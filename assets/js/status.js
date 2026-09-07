/* =========================================================================
   VARN  —  system status
   =========================================================================
   Feeds two surfaces from one endpoint:

     [data-status-strip]  the compact live strip on index.html
     [data-status-page]   the full board on status.html

   Both are progressive: the markup ships with a neutral resting state, this
   file fills it in, and nothing on either page depends on the fetch landing.

   ------------------------------------------------------------------------
   THE CONTRACT
   ------------------------------------------------------------------------
   Point STATUS_ENDPOINT at the admin dashboard's status route. It must
   answer GET with JSON, CORS open to this origin, and no credentials:

   {
     "page":    { "name": "Varn Status", "updatedAt": "2026-09-06T04:00:00Z" },
     "status":  "operational" | "degraded" | "partial" | "major" | "maintenance",
     "uptime":  99.98,                      // aggregate over the range, percent
     "services": [{
       "id": "storefront",
       "name": "Storefront swatches",
       "description": "The script that renders swatches on your theme",
       "group": "product" | "platform" | "account",
       "status": "operational",
       "uptime": 99.98,
       "days": [{ "date": "2026-09-06", "status": "operational", "incidentIds": [] }]
     }],
     "incidents": [{
       "id", "title",
       "severity": "minor" | "major" | "critical",
       "state": "investigating" | "identified" | "monitoring" | "resolved",
       "impact": <a status value>,
       "components": ["storefront"],
       "startedAt", "resolvedAt": null,
       "summary",
       "updates": [{ "at", "state", "body" }]
     }],
     "maintenance": [{ "id", "title", "startsAt", "duration",
                       "componentIds": [], "impact" }]
   }

   `days` is optional. If the live API omits it (it currently sends
   history:false), this page paints one bar per day from the incident
   log: GitHub Issues when the browser can read them, otherwise the
   incidents array on the payload. A day with nothing reported is
   operational. `maintenance` and `incidents` may be empty arrays —
   the page renders the empty state rather than hiding the section.
   The range is passed as ?range=30|60|90.

   While STATUS_ENDPOINT is EMPTY both surfaces run on clearly labelled
   PREVIEW DATA so the design can be reviewed. Preview mode says so on the
   page, in those words, every time. Never ship it silently: a status page
   that invents uptime is worse than no status page.
   ========================================================================= */
(function () {
  "use strict";

  /* The app's own status route (app/routes/api.status.tsx in the Varn repo).
     Absolute rather than relative on purpose: it works whether this static
     site is served from the app's origin or from a different host, because
     the route answers with open CORS headers. If the site ends up on exactly
     the same origin as the app, "/api/status" is the better value — one less
     DNS lookup and no preflight to think about.

     Set this back to "" to return both surfaces to labelled preview data. */
  var STATUS_ENDPOINT = "https://varn.enstacked.com/api/status";

  /* Live. An unreachable endpoint is reported as an error, not silently
     replaced with preview data. Set STATUS_ENDPOINT to "" to review the
     layout on labelled preview data. */
  var STATUS_ENDPOINT_PENDING = false;

  /* Incident log for the history bars. GitHub's API allows CORS GET; a
     private repo without a token 404s and we fall back to incidents on
     the live status payload. */
  var GITHUB_REPO = "enstacked/varn";
  var GITHUB_LABEL = "incident";

  var COMPONENT_ALIASES = {
    storefront: "app",
    admin: "app",
    api: "app",
    webhooks: "app",
    assets: "app",
    billing: "app",
    docs: "app"
  };

  function resolveComponent(id) {
    var key = String(id || "").trim().toLowerCase();
    return COMPONENT_ALIASES[key] || key;
  }

  /* How often to re-check while the tab is in front. */
  var REFRESH_MS = 60000;
  var TIMEOUT_MS = 8000;

  var RANGES = [30, 60, 90];
  var DEFAULT_RANGE = 90;

  var LABEL = {
    operational: "Operational",
    degraded: "Degraded performance",
    partial: "Partial outage",
    major: "Major outage",
    maintenance: "Maintenance"
  };

  var HEADLINE = {
    operational: "All systems operational.",
    degraded: "Some systems are degraded.",
    partial: "Part of Varn is down.",
    major: "Varn is down.",
    maintenance: "Maintenance in progress."
  };

  var RANK = {
    operational: 0,
    maintenance: 1,
    degraded: 2,
    partial: 3,
    major: 4
  };

  var GROUP_LABEL = {
    product: "Product",
    platform: "Platform",
    account: "Account"
  };

  var SEVERITY_LABEL = { minor: "Minor", major: "Major", critical: "Critical" };
  var STATE_LABEL = {
    investigating: "Investigating",
    identified: "Identified",
    monitoring: "Monitoring",
    resolved: "Resolved"
  };

  var REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");

  function qs(sel, scope) {
    return (scope || document).querySelector(sel);
  }

  function qsa(sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  }

  /* The same 14px arrow the rest of the site uses on outbound links. */
  function iconArrow() {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "12");
    svg.setAttribute("height", "12");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.6");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    return svg;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function known(status) {
    return Object.prototype.hasOwnProperty.call(RANK, status)
      ? status
      : "operational";
  }

  function worst(a, b) {
    return RANK[known(a)] >= RANK[known(b)] ? known(a) : known(b);
  }

  function formatUptime(n) {
    if (typeof n !== "number" || !isFinite(n)) return "—";
    if (n >= 99.995) return "100.0";
    return n.toFixed(2);
  }

  function isoDay(date) {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  }

  function parseDay(value) {
    /* Noon local, so a timezone shift can never move a day by one. */
    return new Date(String(value) + "T12:00:00");
  }

  function formatDay(value, withWeekday) {
    var d = parseDay(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, {
      weekday: withWeekday ? "short" : undefined,
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function formatDayShort(value) {
    var d = parseDay(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  function formatTime(value) {
    var d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function relative(value) {
    var then = new Date(value).getTime();
    if (isNaN(then)) return "";
    var secs = Math.max(0, Math.round((Date.now() - then) / 1000));
    if (secs < 45) return "just now";
    if (secs < 5400) return Math.round(secs / 60) + " min ago";
    if (secs < 172800) return Math.round(secs / 3600) + " h ago";
    return Math.round(secs / 86400) + " d ago";
  }

  function duration(startedAt, resolvedAt) {
    var start = new Date(startedAt).getTime();
    var end = resolvedAt ? new Date(resolvedAt).getTime() : Date.now();
    if (isNaN(start) || isNaN(end) || end < start) return "";
    var mins = Math.round((end - start) / 60000);
    if (mins < 60) return mins + " min";
    var hours = Math.floor(mins / 60);
    var rest = mins % 60;
    if (hours < 24) return rest ? hours + " h " + rest + " min" : hours + " h";
    return Math.round(hours / 24) + " d";
  }

  /* =====================================================================
     PREVIEW DATA
     Varn's real surfaces, with a deterministic history so the layout can
     be reviewed. Labelled as preview wherever it is shown.
     ===================================================================== */

  var PREVIEW_SERVICES = [
    {
      id: "analytics",
      name: "Swatch analytics",
      description: "Interaction counting on Advance and Premium",
      group: "product",
      stability: 0.996
    },
    {
      id: "ai",
      name: "AI setup",
      description: "Colour naming and photo matching",
      group: "product",
      stability: 0.994
    },
    {
      id: "jobs",
      name: "Catalogue runs",
      description: "Background setup of many products at once",
      group: "product",
      stability: 0.995
    },
    {
      id: "app",
      name: "App server",
      description: "The server behind the embedded admin and the storefront script",
      group: "platform",
      stability: 0.998
    },
    {
      id: "database",
      name: "Database",
      description: "Install sessions and the analytics store",
      group: "platform",
      stability: 0.997
    }
  ];

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    var a = seed;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function daysBack(count) {
    var out = [];
    var d = new Date();
    for (var i = count - 1; i >= 0; i--) {
      var day = new Date(d);
      day.setDate(d.getDate() - i);
      out.push(isoDay(day));
    }
    return out;
  }

  function uptimeFromDays(days) {
    if (!days || !days.length) return 100;
    var score = 0;
    for (var i = 0; i < days.length; i++) {
      switch (known(days[i].status)) {
        case "operational":
        case "maintenance":
          score += 1;
          break;
        case "degraded":
          score += 0.85;
          break;
        case "partial":
          score += 0.5;
          break;
        default:
          score += 0;
      }
    }
    return (score / days.length) * 100;
  }

  function previewPayload(range) {
    var dayList = daysBack(range);
    var incidents = previewIncidents();

    var services = PREVIEW_SERVICES.map(function (service) {
      var rng = mulberry32(hash(service.id + ":varn"));
      var days = dayList.map(function (date) {
        var ids = [];
        var status = "operational";

        incidents.forEach(function (incident) {
          if (incident.components.indexOf(service.id) === -1) return;
          var start = isoDay(new Date(incident.startedAt));
          if (date !== start) return;
          ids.push(incident.id);
          status = worst(status, incident.impact);
        });

        if (!ids.length) {
          var r = rng();
          var blip = 1 - service.stability;
          if (r > 1 - blip * 0.3) status = "partial";
          else if (r > 1 - blip) status = "degraded";
        }
        return { date: date, status: status, incidentIds: ids };
      });

      return {
        id: service.id,
        name: service.name,
        description: service.description,
        group: service.group,
        status: "operational",
        uptime: uptimeFromDays(days),
        days: days
      };
    });

    var all = [];
    services.forEach(function (s) {
      all = all.concat(s.days);
    });

    return {
      page: {
        name: "Varn Status",
        updatedAt: new Date().toISOString(),
        incidentsUrl: "https://github.com/enstacked/varn/issues"
      },
      status: "operational",
      uptime: uptimeFromDays(all),
      services: services,
      incidents: incidents,
      maintenance: [],
      preview: true
    };
  }

  function daysAgoAt(days, hour, minute) {
    var d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  }

  function previewIncidents() {
    return [
      {
        id: "inc-ai-queue",
        url: "https://github.com/enstacked/varn/issues/1",
        title: "AI setup jobs queued behind a slow vision response",
        severity: "minor",
        state: "resolved",
        impact: "degraded",
        components: ["ai"],
        startedAt: daysAgoAt(9, 11, 20),
        resolvedAt: daysAgoAt(9, 12, 5),
        summary:
          "Photo matching took up to 40 seconds to return while the vision provider was slow. Colour-dictionary naming, which runs inside the app, was unaffected, and no AI credits were spent on the failed attempts.",
        updates: [
          {
            at: daysAgoAt(9, 11, 20),
            state: "investigating",
            body: "AI photo matching is slower than usual. Naming from option values is unaffected."
          },
          {
            at: daysAgoAt(9, 11, 44),
            state: "identified",
            body: "Our vision provider is returning slowly. Jobs are queuing rather than failing."
          },
          {
            at: daysAgoAt(9, 12, 5),
            state: "resolved",
            body: "Response times are back to normal and the queue has drained. Credits were not charged for the slow attempts."
          }
        ]
      },
      {
        id: "inc-analytics-lag",
        url: "https://github.com/enstacked/varn/issues/2",
        title: "Swatch analytics reporting lag",
        severity: "minor",
        state: "resolved",
        impact: "degraded",
        components: ["analytics"],
        startedAt: daysAgoAt(34, 8, 5),
        resolvedAt: daysAgoAt(34, 9, 30),
        summary:
          "Interaction counts appeared in the dashboard about 90 minutes late. Nothing was lost: events buffer on the storefront and were written once the backlog cleared.",
        updates: [
          {
            at: daysAgoAt(34, 8, 5),
            state: "identified",
            body: "The analytics writer is behind. Storefront swatches and the admin are unaffected."
          },
          {
            at: daysAgoAt(34, 9, 30),
            state: "resolved",
            body: "The backlog has cleared and counts have backfilled. No events were dropped."
          }
        ]
      }
    ];
  }

  /* =====================================================================
     HISTORY
     The live app API reports this minute's checks and, today, omits daily
     samples (history:false). Bars and the 30/60/90 switcher still have to
     work, so this page paints one day per service from the incident log.
     GitHub Issues are tried first (CORS GET); a private repo 404s and we
     keep whatever incidents the status API already sent.
     ===================================================================== */

  var githubCache = { at: 0, value: null };
  var GITHUB_TTL_MS = 5 * 60 * 1000;
  var GITHUB_WAIT_MS = 2500;

  function labelNames(issue) {
    var labels = issue && issue.labels;
    if (!Array.isArray(labels)) return [];
    return labels
      .map(function (label) {
        if (typeof label === "string") return label;
        return label && typeof label.name === "string" ? label.name : "";
      })
      .filter(Boolean)
      .map(function (name) {
        return name.trim().toLowerCase();
      });
  }

  function pickLabel(labels, prefix, allowed, fallback) {
    for (var i = 0; i < labels.length; i++) {
      if (labels[i].indexOf(prefix) !== 0) continue;
      var value = labels[i].slice(prefix.length).trim();
      if (allowed.indexOf(value) !== -1) return value;
    }
    return fallback;
  }

  function canonicalComponents(ids) {
    var out = [];
    var seen = {};
    (ids || []).forEach(function (id) {
      var key = resolveComponent(id);
      if (!key || seen[key]) return;
      seen[key] = true;
      out.push(key);
    });
    return out;
  }

  function incidentFromIssue(issue) {
    if (!issue || issue.pull_request) return null;
    var number = typeof issue.number === "number" ? issue.number : null;
    var title = typeof issue.title === "string" ? issue.title.trim() : "";
    var startedAt = issue.created_at;
    if (!number || !title || !startedAt) return null;

    var labels = labelNames(issue);
    var closed = issue.state === "closed";
    var components = canonicalComponents(
      labels
        .filter(function (label) {
          return label.indexOf("component:") === 0;
        })
        .map(function (label) {
          return label.slice("component:".length).trim();
        })
    );

    return {
      id: "gh-" + number,
      title: title,
      url: typeof issue.html_url === "string" ? issue.html_url : undefined,
      severity: pickLabel(labels, "severity:", ["minor", "major", "critical"], "minor"),
      state: closed
        ? "resolved"
        : pickLabel(
            labels,
            "status:",
            ["investigating", "identified", "monitoring", "resolved"],
            "investigating"
          ),
      impact: pickLabel(
        labels,
        "impact:",
        ["operational", "degraded", "partial", "major", "maintenance"],
        "degraded"
      ),
      components: components,
      startedAt: startedAt,
      resolvedAt: closed && issue.closed_at ? issue.closed_at : null,
      summary: typeof issue.body === "string" ? issue.body.slice(0, 1200) : "",
      updates: []
    };
  }

  function maintenanceFromIssue(issue) {
    if (!issue || issue.pull_request) return null;
    var number = typeof issue.number === "number" ? issue.number : null;
    var title = typeof issue.title === "string" ? issue.title.trim() : "";
    var body = typeof issue.body === "string" ? issue.body : "";
    if (!number || !title) return null;
    var starts = body.match(/^\s*starts?\s*:\s*(.+)$/im);
    if (!starts) return null;
    var startsAt = new Date(starts[1].trim());
    if (isNaN(startsAt.getTime())) return null;
    var duration = body.match(/^\s*duration\s*:\s*(.+)$/im);
    var labels = labelNames(issue);
    return {
      id: "gh-" + number,
      title: title,
      startsAt: startsAt.toISOString(),
      duration: duration ? duration[1].trim() : "",
      componentIds: canonicalComponents(
        labels
          .filter(function (label) {
            return label.indexOf("component:") === 0;
          })
          .map(function (label) {
            return label.slice("component:".length).trim();
          })
      ),
      impact: body.replace(/^\s*(starts?|duration)\s*:.*$/gim, "").trim(),
      url: typeof issue.html_url === "string" ? issue.html_url : undefined
    };
  }

  function githubJson(url) {
    return window
      .fetch(url, {
        method: "GET",
        cache: "no-store",
        credentials: "omit",
        headers: { Accept: "application/vnd.github+json" }
      })
      .then(function (response) {
        if (!response.ok) return null;
        return response.json();
      })
      .catch(function () {
        return null;
      });
  }

  function emptyGithubLog() {
    return {
      incidents: [],
      maintenance: [],
      repoUrl: GITHUB_REPO ? "https://github.com/" + GITHUB_REPO + "/issues" : ""
    };
  }

  function fetchGithubLog() {
    if (!GITHUB_REPO) return Promise.resolve(emptyGithubLog());
    var now = Date.now();
    if (githubCache.value && now - githubCache.at < GITHUB_TTL_MS) {
      return Promise.resolve(githubCache.value);
    }

    var base =
      "https://api.github.com/repos/" +
      GITHUB_REPO +
      "/issues?state=all&per_page=50&sort=created&direction=desc";

    var request = Promise.all([
      githubJson(base + "&labels=" + encodeURIComponent(GITHUB_LABEL)),
      githubJson(base + "&labels=maintenance")
    ]).then(function (pair) {
      var incidentIssues = pair[0];
      var maintenanceIssues = pair[1];
      var log = emptyGithubLog();
      if (!incidentIssues && !maintenanceIssues) return log;

      log.incidents = (incidentIssues || [])
        .map(incidentFromIssue)
        .filter(Boolean);
      log.maintenance = (maintenanceIssues || [])
        .map(maintenanceFromIssue)
        .filter(Boolean);
      githubCache = { at: Date.now(), value: log };
      return log;
    });

    return new Promise(function (resolve) {
      var settled = false;
      var timer = window.setTimeout(function () {
        if (settled) return;
        settled = true;
        resolve(emptyGithubLog());
      }, GITHUB_WAIT_MS);
      request.then(
        function (log) {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          resolve(log);
        },
        function () {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          resolve(emptyGithubLog());
        }
      );
    });
  }

  function paintServiceDays(services, incidents, range) {
    var dates = daysBack(range);
    var today = dates.length ? dates[dates.length - 1] : isoDay(new Date());

    return services.map(function (service) {
      var existing = Array.isArray(service.days) ? service.days : [];
      var days = existing.length
        ? existing.length > range
          ? existing.slice(existing.length - range)
          : existing
        : dates.map(function (date) {
            var ids = [];
            var status = "operational";
            incidents.forEach(function (incident) {
              var comps = canonicalComponents(incident.components || []);
              if (comps.length && comps.indexOf(service.id) === -1) return;
              var start = String(incident.startedAt || "").slice(0, 10);
              var end = incident.resolvedAt
                ? String(incident.resolvedAt).slice(0, 10)
                : today;
              if (!start || date < start || date > end) return;
              ids.push(incident.id);
              status = worst(status, incident.impact);
            });
            return { date: date, status: status, incidentIds: ids };
          });

      var next = {};
      Object.keys(service).forEach(function (key) {
        next[key] = service[key];
      });
      next.days = days;
      if (typeof next.uptime !== "number") next.uptime = uptimeFromDays(days);
      return next;
    });
  }

  function enhancePayload(payload, range) {
    return fetchGithubLog().then(function (log) {
      var byId = {};
      (payload.incidents || []).forEach(function (incident) {
        byId[incident.id] = incident;
      });
      (log.incidents || []).forEach(function (incident) {
        byId[incident.id] = incident;
      });
      var incidents = Object.keys(byId).map(function (id) {
        return byId[id];
      });

      var maintenance = (payload.maintenance || []).concat(log.maintenance || []);
      var services = paintServiceDays(payload.services, incidents, range);
      var all = [];
      services.forEach(function (service) {
        all = all.concat(service.days);
      });

      payload.incidents = incidents;
      payload.maintenance = maintenance;
      payload.services = services;
      payload.history = true;
      if (typeof payload.uptime !== "number") payload.uptime = uptimeFromDays(all);
      payload.page = payload.page || {};
      if (!payload.page.incidentsUrl && log.repoUrl) {
        payload.page.incidentsUrl = log.repoUrl;
      }
      return payload;
    });
  }

  /* =====================================================================
     FETCH
     ===================================================================== */

  var cache = { payload: null, at: 0, range: DEFAULT_RANGE };

  function load(range, onDone) {
    if (!STATUS_ENDPOINT) {
      window.setTimeout(function () {
        onDone(null, previewPayload(range));
      }, 260);
      return;
    }

    var url =
      STATUS_ENDPOINT + (STATUS_ENDPOINT.indexOf("?") === -1 ? "?" : "&") +
      "range=" + range;

    var controller =
      typeof AbortController === "function" ? new AbortController() : null;
    var timer = window.setTimeout(function () {
      if (controller) controller.abort();
    }, TIMEOUT_MS);

    window
      .fetch(url, {
        method: "GET",
        cache: "no-store",
        credentials: "omit",
        headers: { Accept: "application/json" },
        signal: controller ? controller.signal : undefined
      })
      .then(function (response) {
        window.clearTimeout(timer);
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (payload) {
        if (!payload || !Array.isArray(payload.services)) {
          throw new Error("Unexpected payload");
        }
        return enhancePayload(payload, range);
      })
      .then(function (payload) {
        cache.payload = payload;
        cache.at = Date.now();
        cache.range = range;
        onDone(null, payload);
      })
      .catch(function (error) {
        window.clearTimeout(timer);
        if (STATUS_ENDPOINT_PENDING) {
          /* Not deployed yet: show the shape of the page, clearly labelled,
             rather than an outage that is really just an absent route. */
          onDone(null, previewPayload(range));
          return;
        }
        onDone(error, null);
      });
  }

  /* Overall status is what the endpoint says; if it omits it, derive it. */
  function overallOf(payload) {
    if (payload.status) return known(payload.status);
    return payload.services.reduce(function (acc, s) {
      return worst(acc, s.status);
    }, "operational");
  }

  /* =====================================================================
     1. THE STRIP  —  index.html
     ===================================================================== */
  (function strip() {
    var host = qs("[data-status-strip]");
    if (!host) return;

    var dot = qs("[data-strip-dot]", host);
    var label = qs("[data-strip-label]", host);
    var detail = qs("[data-strip-detail]", host);
    var dots = qs("[data-strip-services]", host);

    load(DEFAULT_RANGE, function (error, payload) {
      if (error || !payload) {
        /* The landing page is not the place to explain an outage of the
           status endpoint itself. Say less, link on. */
        host.setAttribute("data-state", "error");
        label.textContent = "Status unavailable";
        detail.textContent = "The status page has the detail.";
        return;
      }

      var overall = overallOf(payload);
      host.setAttribute("data-state", "ready");
      host.setAttribute("data-status", overall);
      dot.setAttribute("data-status", overall);
      label.textContent = LABEL[overall];

      var bits = [];
      if (typeof payload.uptime === "number") {
        bits.push(formatUptime(payload.uptime) + "% uptime, 90 days");
      }
      if (payload.preview) bits.push("preview data");
      else if (payload.page && payload.page.updatedAt) {
        bits.push("checked " + relative(payload.page.updatedAt));
      }
      detail.textContent = bits.join(" · ");

      if (!dots) return;
      dots.textContent = "";
      payload.services.slice(0, 9).forEach(function (service) {
        var pip = el("span", "status-strip__pip");
        pip.setAttribute("data-status", known(service.status));
        pip.setAttribute("title", service.name + " — " + LABEL[known(service.status)]);
        dots.appendChild(pip);
      });
      dots.setAttribute(
        "aria-label",
        payload.services.length + " services, " + LABEL[overall].toLowerCase()
      );
    });
  })();

  /* =====================================================================
     2. THE BOARD  —  status.html
     ===================================================================== */
  (function board() {
    var page = qs("[data-status-page]");
    if (!page) return;

    var noteHost = qs("[data-status-note]", page);
    var pill = qs("[data-status-pill]", page);
    var pillDot = qs("[data-status-pill-dot]", page);
    var pillLabel = qs("[data-status-pill-label]", page);
    var pillChecked = qs("[data-status-checked]", page);
    var title = qs("[data-status-title]", page);
    var lead = qs("[data-status-lead]", page);
    var live = qs("[data-status-live]", page);
    var groupsHost = qs("[data-status-groups]", page);
    var incidentsHost = qs("[data-status-incidents]", page);
    var activeHost = qs("[data-status-active]", page);
    var activeList = qs("[data-status-active-list]", page);
    var maintenanceHost = qs("[data-status-maintenance]", page);
    var rangeButtons = qsa("[data-status-range]", page);
    var rangeWrap = qs("[data-status-ranges]", page);
    var sectionSub = qs("[data-status-sub]", page);
    var legend = qs("[data-status-legend]", page);
    var retry = qs("[data-status-retry]", page);
    /* Outside [data-status-page] on purpose: fixed to the viewport so no
       scroll container can clip it. Query from the document, not the
       page, or it is never found and every hover is inert. */
    var tip = qs("[data-status-tip]");

    var range = DEFAULT_RANGE;
    var selectedDate = null;
    var current = null;
    var timer = null;

    function setNote(kind, text) {
      if (!noteHost) return;
      if (!kind) {
        noteHost.hidden = true;
        noteHost.textContent = "";
        return;
      }
      noteHost.hidden = false;
      noteHost.setAttribute("data-kind", kind);
      noteHost.textContent = text;
    }

    function skeleton() {
      groupsHost.setAttribute("aria-busy", "true");
      groupsHost.textContent = "";
      for (var i = 0; i < 4; i++) {
        var row = el("div", "st-skel");
        row.appendChild(el("span", "st-skel__line"));
        row.appendChild(el("span", "st-skel__bar"));
        groupsHost.appendChild(row);
      }
    }

    /* ---- tooltip, shared by every tick ---- */
    var tipTitle = tip ? qs("[data-tip-title]", tip) : null;
    var tipBody = tip ? qs("[data-tip-body]", tip) : null;

    /* What the tooltip is currently describing, so a scroll can decide
       between following it and dropping it. */
    var tipFor = null;

    function showTip(point, target) {
      if (!tip) return;
      tipFor = { point: point, target: target };
      var rect = target.getBoundingClientRect();
      tipTitle.textContent = formatDay(point.date, true);
      tipBody.textContent = LABEL[known(point.status)];
      tip.hidden = false;
      /* Measured after unhiding, so the clamp uses the real width. */
      var half = tip.offsetWidth / 2;
      var x = Math.min(
        Math.max(rect.left + rect.width / 2, half + 8),
        window.innerWidth - half - 8
      );
      tip.style.left = x + "px";
      tip.style.top = rect.top - 10 + "px";
    }

    function hideTip() {
      tipFor = null;
      if (tip) tip.hidden = true;
    }

    /* Focusing a tick can scroll it into view, and dropping the tooltip on
       that scroll would hide the one thing the keyboard user just asked
       for. So a scroll follows the tick while it still has focus, and only
       drops the tooltip when it does not. */
    function onScroll() {
      if (tipFor && tipFor.target === document.activeElement) {
        showTip(tipFor.point, tipFor.target);
        return;
      }
      hideTip();
    }

    function hasHistory(payload) {
      return (payload.services || []).some(function (service) {
        return Array.isArray(service.days) && service.days.length > 0;
      });
    }

    function renderBar(service) {
      var wrap = el("div", "st-bar-wrap");
      var all = Array.isArray(service.days) ? service.days : [];
      /* An endpoint that ignores ?range and returns more history than
         asked for must not make the bars disagree with the sentence
         above them. Trim to what was requested. */
      var days = all.length > range ? all.slice(all.length - range) : all;

      if (!days.length) return null;

      var bar = el("div", "st-bar");
      bar.setAttribute("role", "group");
      bar.setAttribute(
        "aria-label",
        service.name + ", daily status for the last " + days.length + " days"
      );

      days.forEach(function (point) {
        var tick = el("button", "st-tick");
        tick.type = "button";
        tick.setAttribute("data-status", known(point.status));
        tick.setAttribute(
          "aria-label",
          formatDay(point.date) + ": " + LABEL[known(point.status)]
        );
        tick.setAttribute(
          "aria-pressed",
          selectedDate === point.date ? "true" : "false"
        );
        if (selectedDate && selectedDate !== point.date) {
          tick.setAttribute("data-dim", "true");
        }

        tick.addEventListener("mouseenter", function () {
          showTip(point, tick);
        });
        /* A wheel scroll under a stationary pointer drops the tooltip, and
           mouseenter will not fire again because the pointer never left.
           mousemove brings it back the moment the hand moves at all. */
        tick.addEventListener("mousemove", function () {
          showTip(point, tick);
        });
        tick.addEventListener("mouseleave", hideTip);
        tick.addEventListener("focus", function () {
          showTip(point, tick);
        });
        tick.addEventListener("blur", hideTip);
        tick.addEventListener("click", function () {
          selectedDate = selectedDate === point.date ? null : point.date;
          render();
        });

        bar.appendChild(tick);
      });

      var axis = el("div", "st-axis");
      axis.appendChild(el("span", null, formatDayShort(days[0].date)));
      axis.appendChild(el("span", "st-axis__mid", days.length + " days"));
      axis.appendChild(el("span", null, "Today"));

      wrap.appendChild(bar);
      wrap.appendChild(axis);

      /* If a longer range ever overflows the row, the right-hand end is the
         one that matters: land on today, let the reader scroll back. */
      window.requestAnimationFrame(function () {
        if (wrap.scrollWidth > wrap.clientWidth) {
          wrap.scrollLeft = wrap.scrollWidth;
        }
      });

      return wrap;
    }

    function renderServices(payload) {
      groupsHost.removeAttribute("aria-busy");
      groupsHost.textContent = "";

      var order = ["product", "platform", "account"];
      var seen = {};
      payload.services.forEach(function (s) {
        var g = s.group || "product";
        if (order.indexOf(g) === -1 && !seen[g]) order.push(g);
        seen[g] = true;
      });

      order.forEach(function (groupId) {
        var members = payload.services.filter(function (s) {
          return (s.group || "product") === groupId;
        });
        if (!members.length) return;

        var section = el("section", "st-group");
        section.appendChild(
          el("h3", "st-group__title", GROUP_LABEL[groupId] || groupId)
        );

        members.forEach(function (service) {
          var row = el("article", "st-svc");

          var head = el("div", "st-svc__head");
          var idBlock = el("div");
          var name = el("p", "st-svc__name");
          var dot = el("span", "st-dot");
          dot.setAttribute("data-status", known(service.status));
          dot.setAttribute("aria-hidden", "true");
          name.appendChild(dot);
          name.appendChild(document.createTextNode(service.name));
          idBlock.appendChild(name);
          if (service.description) {
            idBlock.appendChild(el("p", "st-svc__desc", service.description));
          }

          var meta = el("div", "st-svc__meta");
          meta.appendChild(
            el("span", "st-svc__state", LABEL[known(service.status)])
          );
          if (typeof service.uptime === "number") {
            meta.appendChild(
              el("span", "st-svc__uptime", formatUptime(service.uptime) + "%")
            );
          }
          if (typeof service.latencyMs === "number") {
            var latency = el(
              "span",
              "st-svc__latency",
              Math.round(service.latencyMs) + " ms"
            );
            latency.title = "Round trip of the last check";
            meta.appendChild(latency);
          }

          head.appendChild(idBlock);
          head.appendChild(meta);
          row.appendChild(head);

          var bar = renderBar(service);
          if (bar) row.appendChild(bar);
          section.appendChild(row);
        });

        groupsHost.appendChild(section);
      });
    }

    function incidentCard(incident, services) {
      var card = el("article", "st-inc");
      card.setAttribute("data-severity", incident.severity || "minor");

      var head = el("div", "st-inc__head");
      var titleEl = el("h3", "st-inc__title", incident.title);
      head.appendChild(titleEl);

      var badges = el("p", "st-inc__badges");
      var state = el(
        "span",
        "st-inc__badge",
        STATE_LABEL[incident.state] || incident.state
      );
      state.setAttribute("data-state", incident.state || "resolved");
      badges.appendChild(state);
      if (incident.severity) {
        badges.appendChild(
          el(
            "span",
            "st-inc__badge st-inc__badge--sev",
            SEVERITY_LABEL[incident.severity] || incident.severity
          )
        );
      }
      head.appendChild(badges);
      card.appendChild(head);

      var meta = [];
      if (incident.startedAt) meta.push(formatTime(incident.startedAt));
      var span = duration(incident.startedAt, incident.resolvedAt);
      if (span) meta.push(span);
      var names = (incident.components || []).map(function (id) {
        var canonical = resolveComponent(id);
        var match = services.filter(function (s) {
          return s.id === canonical || s.id === id;
        })[0];
        return match ? match.name : id;
      });
      if (names.length) meta.push(names.join(", "));
      if (meta.length) card.appendChild(el("p", "st-inc__meta", meta.join(" · ")));

      if (incident.summary) {
        card.appendChild(el("p", "st-inc__summary", incident.summary));
      }

      /* Provenance. An incident nobody can click through to is a claim; one
         that links to the issue it was written in is a record. */
      if (incident.url) {
        var source = el("p", "st-inc__source");
        var link = el("a", null, "View on GitHub");
        link.href = incident.url;
        link.rel = "noopener";
        link.appendChild(iconArrow());
        source.appendChild(link);
        card.appendChild(source);
      }

      var updates = incident.updates || [];
      if (updates.length) {
        var list = el("ol", "st-inc__updates");
        /* Newest first, by timestamp rather than by array position: the
           endpoint's own ordering is not part of the contract, and a
           reversed list reads as a rewritten history. */
        updates
          .slice()
          .sort(function (a, b) {
            return new Date(b.at) - new Date(a.at);
          })
          .forEach(function (update) {
            var item = el("li", "st-inc__update");
            var when = el("p", "st-inc__update-head");
            when.appendChild(
              el(
                "span",
                "st-inc__update-state",
                STATE_LABEL[update.state] || update.state
              )
            );
            when.appendChild(el("span", "st-inc__update-at", formatTime(update.at)));
            item.appendChild(when);
            item.appendChild(el("p", "st-inc__update-body", update.body));
            list.appendChild(item);
          });
        card.appendChild(list);
      }

      return card;
    }

    /* Unresolved incidents, repeated above the grid. A reader who arrives
       mid-incident should not have to scroll past nine healthy services to
       find the one thing that is wrong. */
    function renderActive(payload) {
      if (!activeHost || !activeList) return;

      var open = (payload.incidents || []).filter(function (incident) {
        return incident.state && incident.state !== "resolved";
      });

      if (!open.length) {
        activeHost.hidden = true;
        activeList.textContent = "";
        return;
      }

      activeHost.hidden = false;
      activeList.textContent = "";
      open
        .sort(function (a, b) {
          return new Date(b.startedAt) - new Date(a.startedAt);
        })
        .forEach(function (incident) {
          activeList.appendChild(incidentCard(incident, payload.services));
        });
    }

    function renderIncidents(payload) {
      incidentsHost.textContent = "";

      var incidents = (payload.incidents || []).slice();
      incidents.sort(function (a, b) {
        return new Date(b.startedAt) - new Date(a.startedAt);
      });

      if (selectedDate) {
        incidents = incidents.filter(function (incident) {
          return isoDay(new Date(incident.startedAt)) === selectedDate;
        });
      }

      if (selectedDate) {
        var filter = el("div", "st-filter");
        filter.appendChild(
          el("span", null, "Showing " + formatDay(selectedDate, true))
        );
        var clear = el("button", "btn btn--ghost btn--sm", "Show all");
        clear.type = "button";
        clear.addEventListener("click", function () {
          selectedDate = null;
          render();
        });
        filter.appendChild(clear);
        incidentsHost.appendChild(filter);
      }

      if (!incidents.length) {
        var empty = el("div", "st-empty");
        empty.appendChild(
          el(
            "p",
            "st-empty__title",
            selectedDate ? "Nothing happened that day." : "No incidents reported."
          )
        );
        empty.appendChild(
          el(
            "p",
            "st-empty__copy",
            selectedDate
              ? "No incident touched this date."
              : "Nothing has been reported. Incidents are opened as GitHub issues and appear here as soon as they are, before they are understood."
          )
        );
        incidentsHost.appendChild(empty);
        return;
      }

      incidents.forEach(function (incident) {
        incidentsHost.appendChild(incidentCard(incident, payload.services));
      });

      if (payload.page && payload.page.incidentsUrl) {
        var all = el("p", "st-inc__all");
        var allLink = el("a", null, "Every incident on GitHub");
        allLink.href = payload.page.incidentsUrl;
        allLink.rel = "noopener";
        allLink.appendChild(iconArrow());
        all.appendChild(allLink);
        incidentsHost.appendChild(all);
      }
    }

    function renderMaintenance(payload) {
      if (!maintenanceHost) return;
      maintenanceHost.textContent = "";

      var items = (payload.maintenance || []).filter(function (m) {
        return new Date(m.startsAt).getTime() > Date.now() - 86400000;
      });

      if (!items.length) {
        /* Same empty component as the incident list: two different shapes for
           "there is nothing here" reads as two different meanings. */
        var empty = el("div", "st-empty");
        empty.appendChild(el("p", "st-empty__title", "No maintenance is scheduled."));
        empty.appendChild(
          el(
            "p",
            "st-empty__copy",
            "Planned work appears here before it starts, with what it will affect."
          )
        );
        maintenanceHost.appendChild(empty);
        return;
      }

      items.forEach(function (item) {
        var card = el("article", "st-mnt");
        card.appendChild(el("h3", "st-mnt__title", item.title));
        var meta = [formatTime(item.startsAt)];
        if (item.duration) meta.push(item.duration);
        card.appendChild(el("p", "st-inc__meta", meta.join(" · ")));
        if (item.impact) card.appendChild(el("p", "st-inc__summary", item.impact));
        maintenanceHost.appendChild(card);
      });
    }

    function render() {
      if (!current) return;
      var payload = current;
      var overall = overallOf(payload);

      page.setAttribute("data-status", overall);
      pillDot.setAttribute("data-status", overall);
      /* Restored after a failed check took it away. */
      if (overall === "operational") pillDot.classList.add("st-dot--live");
      else pillDot.classList.remove("st-dot--live");
      pillLabel.textContent = LABEL[overall];
      title.textContent = HEADLINE[overall];

      if (payload.page && payload.page.updatedAt) {
        pillChecked.textContent = "Checked " + relative(payload.page.updatedAt);
      } else {
        pillChecked.textContent = "Checked " + relative(new Date().toISOString());
      }

      var history = hasHistory(payload);

      if (history && typeof payload.uptime === "number") {
        lead.textContent =
          "Aggregate uptime across every Varn service over the last " +
          range +
          " days is " +
          formatUptime(payload.uptime) +
          "%.";
      } else {
        lead.textContent =
          "Every service below is checked live against the Varn app, about once a minute.";
      }

      /* A range switcher with nothing to range over is a control that lies. */
      if (rangeWrap) rangeWrap.hidden = !history;
      if (legend) legend.hidden = false;
      if (sectionSub) {
        sectionSub.textContent = history
          ? "Daily status per service. Select a day to see what happened."
          : "The result of the last check on each service.";
      }

      /* One polite announcement per change, not per repaint. */
      if (live && live.getAttribute("data-said") !== overall) {
        live.textContent = LABEL[overall] + ". " + HEADLINE[overall];
        live.setAttribute("data-said", overall);
      }

      renderActive(payload);
      renderServices(payload);
      renderIncidents(payload);
      renderMaintenance(payload);
    }

    function fetchAndRender(showSkeleton) {
      if (showSkeleton) skeleton();
      load(range, function (error, payload) {
        if (error || !payload) {
          if (current) {
            setNote(
              "error",
              "Could not reach the status API just now. Showing the last successful check, " +
                relative(cache.at || Date.now()) + "."
            );
          } else {
            setNote(
              "error",
              "Could not reach the status API. Nothing is being reported here yet — this is a problem with this page, not necessarily with Varn."
            );
            groupsHost.removeAttribute("aria-busy");
            groupsHost.textContent = "";
            pillLabel.textContent = "Status unavailable";
            pillChecked.textContent = "";
            /* A green dot beside "we cannot reach the status API" is the page
               contradicting itself in the one place people glance first.
               Unknown is its own tone, and it does not pulse: nothing is
               being received to pulse about. */
            pillDot.setAttribute("data-status", "unknown");
            pillDot.classList.remove("st-dot--live");
            page.setAttribute("data-status", "unknown");
            /* Nothing came back, so every control that acts on data is inert:
               a range switcher over no history, a legend for no ticks, and a
               caption inviting a click on days that are not there. */
            if (rangeWrap) rangeWrap.hidden = true;
            if (legend) legend.hidden = true;
            if (sectionSub) {
              sectionSub.textContent =
                "Nothing to show until the status API answers.";
            }
            title.textContent = "We cannot reach the status API.";
            lead.textContent =
              "Try again, or write to support@enstacked.com and we will tell you what we can see.";
          }
          if (retry) retry.hidden = false;
          return;
        }

        if (retry) retry.hidden = true;
        current = payload;

        if (payload.preview) {
          setNote(
            "preview",
            STATUS_ENDPOINT_PENDING
              ? "Not connected yet. The status API is not answering at " +
                STATUS_ENDPOINT +
                " — until it is deployed, every figure below is an example, not a measurement."
              : "Preview data. This page is not connected to the Varn status API yet, so every figure below is an example, not a measurement."
          );
        } else {
          setNote(null);
        }

        render();
      });
    }

    rangeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var next = parseInt(button.getAttribute("data-status-range"), 10);
        if (RANGES.indexOf(next) === -1 || next === range) return;
        range = next;
        selectedDate = null;
        rangeButtons.forEach(function (other) {
          other.setAttribute(
            "aria-pressed",
            other === button ? "true" : "false"
          );
        });
        fetchAndRender(true);
      });
    });

    if (retry) {
      retry.addEventListener("click", function () {
        retry.hidden = true;
        fetchAndRender(true);
      });
    }

    /* The tooltip is anchored to the viewport, so it has to follow a scroll
       or leave. Leaving is the honest option and costs nothing. */
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    fetchAndRender(true);

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        if (!document.hidden) fetchAndRender(false);
      }, REFRESH_MS);
    }

    schedule();

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) fetchAndRender(false);
    });

    /* Keep "Checked N min ago" honest between fetches. */
    window.setInterval(function () {
      if (!current || document.hidden) return;
      var at =
        current.page && current.page.updatedAt
          ? current.page.updatedAt
          : new Date(cache.at || Date.now()).toISOString();
      pillChecked.textContent = "Checked " + relative(at);
    }, 15000);

    if (REDUCED_MOTION.matches) page.setAttribute("data-still", "true");
  })();

  var year = qs("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
