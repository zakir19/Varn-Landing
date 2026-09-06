/* =========================================================================
   VARN  —  waitlist.html
   =========================================================================
   Two independent modules in one IIFE, same convention as main.js:

     1. flow()      the liquid brand field behind the page (WebGL, optional)
     2. waitlist()  the signup form and its states

   Neither depends on the other. If WebGL is missing the CSS gradient is the
   ground; if this file fails to load at all the form still submits natively
   when an endpoint is set, and says so honestly when one is not.
   ========================================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     MAILERLITE — where the waitlist actually lands.

     These two ids come from the embed MailerLite generates for the form;
     they are the only part of that embed we keep. Everything else — the
     markup, the styling, the states — is ours, so the page looks like
     Varn rather than like a MailerLite widget.

       account  the number after /jsonp/ in the embed's form action
       form     the number after /forms/ in that same URL

     HOW THE SUBMIT WORKS, AND WHY IT IS NOT fetch():
     MailerLite's classic endpoint sends no CORS headers, so a fetch from
     this origin is blocked by the browser before MailerLite ever sees it.
     That is exactly why their own embed falls back to target="_blank".
     The path is literally /jsonp/, though, so it answers a JSONP call:
     a <script> tag is not subject to CORS, and a real response tells us
     the signup landed rather than us assuming it did.
     ------------------------------------------------------------------ */
  var MAILERLITE = {
    account: "2519972",
    form: "197865579280861031"
  };

  /* ------------------------------------------------------------------
     OPTIONAL OVERRIDE. Any endpoint that accepts a JSON POST — your own
     handler, a Formspree URL, an Apps Script web app. When this is set it
     WINS over MailerLite, which is the seam to use if the list ever moves
     or you want signups to hit your own server first.

     With this empty AND the MailerLite ids blank, the page runs in DEMO
     mode: the whole flow plays so it can be reviewed, nothing is stored,
     and the console says so on every submit.
     ------------------------------------------------------------------ */
  var WAITLIST_ENDPOINT = "";

  /* Where a returning visitor's confirmation is remembered. Clearing site
     data clears it, which is the correct behaviour: the list itself lives
     on the endpoint, this is only what THIS browser has already seen. */
  var STORE_KEY = "varn:waitlist";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* =================================================================
     1. LIQUID FLOW BACKGROUND
     One full-screen triangle, one fragment shader. The shader domain-
     warps fbm noise (Quilez's q/r construction) so the field flows like
     liquid rather than wobbling in place, then maps it through the brand
     palette with a large-scale white bloom on top. Slow by design — the
     reference is silk, not lava.
     ================================================================= */
  (function flow() {
    var canvas = document.querySelector("[data-flow]");
    if (!canvas || !window.WebGLRenderingContext) return;

    var gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: true
    });
    if (!gl) return; /* CSS ground shows through — fine. */

    var VERT =
      "attribute vec2 p;" +
      "void main(){gl_Position=vec4(p,0.,1.);}";

    var FRAG =
      "precision mediump float;" +
      "uniform vec2 R;uniform float T;" +
      "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}" +
      "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);" +
      "return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}" +
      "float fbm(vec2 p){float v=0.,a=.5;" +
      "for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(11.3,7.9);a*=.5;}return v;}" +
      "void main(){" +
      "vec2 uv=gl_FragCoord.xy/R;" +
      "vec2 p=uv*vec2(R.x/R.y,1.)*1.6;" +
      "float t=T*.045;" +
      "vec2 q=vec2(fbm(p+vec2(t*.9,t*.3)),fbm(p+vec2(5.2+t*.4,1.3-t*.5)));" +
      "vec2 r=vec2(fbm(p+3.2*q+vec2(1.7+t*.35,9.2)),fbm(p+3.2*q+vec2(8.3-t*.3,2.8)));" +
      "float v=fbm(p+2.6*r);" +
      "vec3 c=mix(vec3(.878,.867,.957),vec3(.498,.467,.867),smoothstep(.25,.78,v));" +
      "c=mix(c,vec3(.929,.576,.694),smoothstep(.35,.9,r.x)*.7);" +
      "c=mix(c,vec3(.898,.560,.420),smoothstep(.55,.95,q.y)*.35);" +
      "float bloom=fbm(p*.55+vec2(-t*.6,t*.25));" +
      "c=mix(c,vec3(.988,.984,.976),smoothstep(.42,.85,bloom)*.85);" +
      "float vg=smoothstep(1.25,.45,distance(uv,vec2(.5,.45)));" +
      "c=mix(c*.985,c,vg);" +
      "gl_FragColor=vec4(c,1.);}";

    function compile(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null;
      return sh;
    }

    var vs = compile(gl.VERTEX_SHADER, VERT);
    var fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uR = gl.getUniformLocation(prog, "R");
    var uT = gl.getUniformLocation(prog, "T");

    function size() {
      /* DPR capped at 1.5: the field is soft by nature, extra pixels buy
         nothing but battery. */
      var d = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.round(canvas.clientWidth * d);
      var hgt = Math.round(canvas.clientHeight * d);
      if (canvas.width !== w || canvas.height !== hgt) {
        canvas.width = w;
        canvas.height = hgt;
        gl.viewport(0, 0, w, hgt);
      }
    }

    function draw(t) {
      size();
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    var start = null;
    var raf = null;

    function loop(now) {
      if (start === null) start = now;
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    }

    /* First frame synchronously, so there is never a blank flash and the
       fade-in reveals a finished field. */
    draw(0);
    canvas.classList.add("is-live");

    function play() {
      if (raf || reduceMotion.matches) return;
      start = null; /* re-anchor: no giant time jump on return */
      raf = requestAnimationFrame(loop);
    }

    function pause() {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    play();

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pause();
      else play();
    });

    /* A visitor can turn motion off while the page is open. */
    if (typeof reduceMotion.addEventListener === "function") {
      reduceMotion.addEventListener("change", function () {
        if (reduceMotion.matches) {
          pause();
          draw(0);
        } else {
          play();
        }
      });
    }

    window.addEventListener("resize", function () {
      if (reduceMotion.matches) draw(0);
    });
  })();

  /* =================================================================
     2. THE FORM
     ================================================================= */
  (function waitlist() {
    var form = document.querySelector("[data-wl-form]");
    var formView = document.querySelector("[data-wl-form-view]");
    var doneView = document.querySelector("[data-wl-done-view]");
    if (!form || !formView || !doneView) return;

    var input = form.querySelector("[data-wl-email]");
    var trap = form.querySelector("[data-wl-trap]");
    var button = form.querySelector("[data-wl-submit]");
    var label = button.querySelector("[data-wl-label]");
    var icon = button.querySelector("[data-wl-icon]");
    var msg = form.querySelector("[data-wl-msg]");
    var busy = false;

    /* The markup already posts to MailerLite without JavaScript. A custom
       endpoint takes that over, and drops the new tab with it. */
    if (WAITLIST_ENDPOINT) {
      form.setAttribute("action", WAITLIST_ENDPOINT);
      form.setAttribute("method", "post");
      form.removeAttribute("target");
    }

    function mailerliteConfigured() {
      return Boolean(MAILERLITE && MAILERLITE.account && MAILERLITE.form);
    }

    /* Deliberately permissive: the endpoint and the invite email are what
       actually validate an address. This only catches obvious typos. */
    function looksLikeEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    function say(text, tone) {
      msg.textContent = text || "";
      if (tone) msg.setAttribute("data-tone", tone);
      else msg.removeAttribute("data-tone");
    }

    function fail(text) {
      say(text);
      input.setAttribute("data-state", "error");
      input.setAttribute("aria-invalid", "true");
      input.focus();
    }

    function clear() {
      say("");
      input.removeAttribute("data-state");
      input.removeAttribute("aria-invalid");
    }

    function setBusy(on) {
      busy = on;
      button.disabled = on;
      button.setAttribute("aria-busy", on ? "true" : "false");
      label.textContent = on ? "Joining" : "Get early access";
      icon.hidden = on;

      var spinner = button.querySelector(".wl__spinner");
      if (on && !spinner) {
        spinner = document.createElement("span");
        spinner.className = "wl__spinner";
        button.appendChild(spinner);
      } else if (!on && spinner) {
        spinner.remove();
      }
    }

    /* ----------------------------------------------------------------
       JSONP submit to MailerLite.

       A <script> tag, because the endpoint sends no CORS headers and a
       fetch would never leave the browser. Success is either callback
       firing, OR the script loading cleanly — MailerLite's response calls
       a name of its own choosing (their embed ships an
       ml_webform_success_<formId> function for exactly that), so we listen
       for both ours and theirs and treat a clean load as the third signal.
       A 4xx, a 5xx, a blocked request or a dropped connection all fire
       onerror instead, which is a real failure and is reported as one.
       ---------------------------------------------------------------- */
    function submitToMailerlite(email, onDone) {
      var name = "wlcb_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);
      var theirs = "ml_webform_success_" + MAILERLITE.form;
      var script = document.createElement("script");
      var settled = false;
      var timer = null;

      function finish(ok) {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        try {
          delete window[name];
        } catch (e) {
          window[name] = undefined;
        }
        if (window[theirs] === handler) {
          try {
            delete window[theirs];
          } catch (e2) {
            window[theirs] = undefined;
          }
        }
        if (script.parentNode) script.parentNode.removeChild(script);
        onDone(ok);
      }

      function handler() {
        finish(true);
      }

      window[name] = handler;
      /* Only claim their callback name if nothing else owns it, so a
         MailerLite script loaded elsewhere on the page keeps working. */
      if (typeof window[theirs] !== "function") window[theirs] = handler;

      var url =
        "https://assets.mailerlite.com/jsonp/" +
        encodeURIComponent(MAILERLITE.account) +
        "/forms/" +
        encodeURIComponent(MAILERLITE.form) +
        "/subscribe?callback=" +
        name +
        "&fields%5Bemail%5D=" +
        encodeURIComponent(email) +
        "&ml-submit=1&anticsrf=true";

      script.src = url;
      script.async = true;
      script.onload = function () {
        /* The response ran. If it called a callback we have already
           settled; if it did not, a clean load still means MailerLite
           accepted the request. */
        finish(true);
      };
      script.onerror = function () {
        finish(false);
      };

      /* A request that never resolves must not leave the button spinning
         forever. Long enough for a slow connection, short enough that
         nobody wonders whether it worked. */
      timer = window.setTimeout(function () {
        finish(false);
      }, 12000);

      document.head.appendChild(script);
    }

    function remember(email) {
      try {
        window.localStorage.setItem(STORE_KEY, email);
      } catch (e) {
        /* Private mode, or storage disabled. The signup still happened;
           only this browser's memory of it is lost. */
      }
    }

    function recall() {
      try {
        return window.localStorage.getItem(STORE_KEY);
      } catch (e) {
        return null;
      }
    }

    function succeed(email, instant) {
      var slot = doneView.querySelector("[data-wl-email]");
      if (slot) slot.textContent = email;

      var swap = function () {
        formView.hidden = true;
        doneView.hidden = false;
        if (!instant) {
          /* Move focus to the confirmation, or a keyboard and screen
             reader user is left on a button that no longer exists. */
          doneView.focus({ preventScroll: true });
        }
      };

      if (instant || reduceMotion.matches) {
        swap();
        return;
      }

      /* Play the form's exit first, then bring the thank-you in with its
         own entrance — one continuous motion. */
      formView.classList.add("is-leaving");
      window.setTimeout(swap, 240);
    }

    /* A visitor who already joined, coming back to the same browser, is
       shown their confirmation rather than an empty form that invites a
       duplicate signup. */
    var known = recall();
    if (known) succeed(known, true);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (busy) return;

      /* Honeypot: only a bot fills a field a person cannot see. Answer
         exactly as if it had worked, so the bot learns nothing. */
      if (trap && trap.value) {
        succeed(input.value.trim() || "you");
        return;
      }

      var email = input.value.trim();

      if (!email) {
        fail("Enter your email address so we know where to send the invite.");
        return;
      }
      if (!looksLikeEmail(email)) {
        fail("That does not look like an email address. Check it and try again.");
        return;
      }

      clear();

      if (!WAITLIST_ENDPOINT && !mailerliteConfigured()) {
        /* DEMO MODE: plays the flow, stores nothing. */
        console.warn(
          "[waitlist] No MAILERLITE ids and no WAITLIST_ENDPOINT in " +
          "assets/js/waitlist.js — this signup was NOT stored."
        );
        setBusy(true);
        window.setTimeout(function () {
          setBusy(false);
          remember(email);
          succeed(email);
        }, 650);
        return;
      }

      setBusy(true);

      if (!WAITLIST_ENDPOINT) {
        submitToMailerlite(email, function (ok) {
          setBusy(false);
          if (!ok) {
            /* The address stays in the field: the visitor retries, they do
               not retype. */
            fail(
              "That did not go through. Try again, or email support@enstacked.com."
            );
            return;
          }
          remember(email);
          succeed(email);
        });
        return;
      }

      window
        .fetch(WAITLIST_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            email: email,
            source: "waitlist-page",
            ts: new Date().toISOString()
          })
        })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          setBusy(false);
          remember(email);
          succeed(email);
        })
        .catch(function () {
          /* The address stays in the field: the visitor retries, they do
             not retype. */
          setBusy(false);
          fail("That did not go through. Try again, or email support@enstacked.com.");
        });
    });

    /* Typing is the visitor fixing what you complained about, so the
       complaint clears as they type. */
    input.addEventListener("input", function () {
      if (input.hasAttribute("data-state")) clear();
    });
  })();

  /* Footer year, so the page never goes stale. */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
