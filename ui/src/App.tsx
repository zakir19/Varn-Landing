import { useState } from "react";
import {
  Button,
  Card,
  Dialog,
  Divider,
  Field,
  Progress,
  SegmentedControl,
  StatusBadge,
  TextInput,
  Toast,
  Toggle,
} from "./components";

const Arrow = () => <span aria-hidden="true">↗</span>;
const Plus = () => <span aria-hidden="true">＋</span>;

type Theme = "light" | "dark";
type Density = "Comfortable" | "Compact";

export function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const [density, setDensity] = useState<Density>("Comfortable");
  const [notifications, setNotifications] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3600);
  };

  return (
    <div className={`prism-app prism-app--${theme}`} data-density={density.toLowerCase()}>
      <a className="prism-skip" href="#showcase">Skip to component showcase</a>
      <aside className="prism-rail" aria-label="Component navigation">
        <a className="prism-rail__brand" href="#top" aria-label="Prism UI home"><span>V</span><b>Prism</b></a>
        <nav>
          <a className="is-active" href="#showcase"><i>01</i> Overview</a>
          <a href="#actions"><i>02</i> Actions</a>
          <a href="#inputs"><i>03</i> Inputs</a>
          <a href="#surfaces"><i>04</i> Surfaces</a>
          <a href="#feedback"><i>05</i> Feedback</a>
        </nav>
        <div className="prism-rail__foot"><span>v0.1.0 / React</span><span>Varn design system</span></div>
      </aside>

      <main id="showcase" className="prism-main">
        <header id="top" className="prism-header">
          <div><p className="prism-kicker">Varn / component system</p><h1>Prism UI</h1></div>
          <div className="prism-header__controls">
            <SegmentedControl value={theme} onChange={setTheme} label="Color theme" options={[{ value: "light", label: "Light" }, { value: "dark", label: "Night" }]} />
            <Button tone="quiet" size="sm" leading={<Plus />} onClick={() => notify("Component request saved")}>Request component</Button>
          </div>
        </header>

        <section className="prism-intro" aria-labelledby="intro-title">
          <div>
            <p className="prism-kicker">A tactile system for configurable commerce</p>
            <h2 id="intro-title">Clear choices, <em>visible consequence.</em></h2>
            <p>Prism turns Varn’s swatch language into a React system: warm paper surfaces, exacting ink edges, and accents that explain state instead of decorating it.</p>
          </div>
          <div className="prism-token-sample" aria-label="Design token sample">
            <div><span>Color</span><b className="token-swatch" /></div><div><span>Radius</span><b className="token-radius" /></div><div><span>Motion</span><b className="token-motion" /></div>
          </div>
        </section>

        <section id="actions" className="prism-section" aria-labelledby="actions-title">
          <div className="prism-section__heading"><p className="prism-kicker">01 / Actions</p><h2 id="actions-title">Buttons carry momentum.</h2><p>Clear hierarchy and a deliberate leading edge make primary actions feel like a committed choice.</p></div>
          <Card accent="violet" className="prism-stage">
            <div className="prism-stage__meta"><span>Button / all states</span><StatusBadge tone="violet">Stable</StatusBadge></div>
            <div className="prism-button-row"><Button leading={<Plus />}>Create swatch</Button><Button tone="violet" trailing={<Arrow />}>Save changes</Button><Button tone="soft">Preview</Button><Button tone="quiet">Cancel</Button><Button tone="danger">Remove</Button><Button loading>Saving</Button><Button disabled>Disabled</Button></div>
          </Card>
        </section>

        <section id="inputs" className="prism-section prism-section--split" aria-labelledby="inputs-title">
          <div className="prism-section__heading"><p className="prism-kicker">02 / Inputs</p><h2 id="inputs-title">Form controls reveal intent.</h2><p>Inputs are set into the surface, not simply outlined. Error and supporting text have a fixed, calm place.</p></div>
          <Card accent="blush" className="prism-form-card">
            <div className="prism-stage__meta"><span>Field / validation</span><StatusBadge tone="success">AA contrast</StatusBadge></div>
            <div className="prism-form-grid">
              <Field label="Collection name" htmlFor="collection" hint="Shown to shoppers on collection cards."><TextInput id="collection" defaultValue="Autumn pigment" /></Field>
              <Field label="Merchant email" htmlFor="email" error={email && !email.includes("@") ? "Enter a complete email address." : undefined}><TextInput id="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@store.com" inputMode="email" /></Field>
            </div>
            <Divider label="PREFERENCES" />
            <Toggle label="Swatch activity" description="Notify the team when a choice runs low." pressed={notifications} onPressedChange={setNotifications} />
            <div className="prism-control-footer"><SegmentedControl value={density} onChange={setDensity} label="Display density" options={[{ value: "Comfortable", label: "Comfortable" }, { value: "Compact", label: "Compact" }]} /><Button size="sm" onClick={() => notify("Draft saved")}>Save draft</Button></div>
          </Card>
        </section>

        <section id="surfaces" className="prism-section" aria-labelledby="surfaces-title">
          <div className="prism-section__heading"><p className="prism-kicker">03 / Surfaces</p><h2 id="surfaces-title">Information has a grain.</h2><p>Cards use a small color registration mark and shadow only when they lift above the page.</p></div>
          <div className="prism-card-grid">
            <Card accent="violet"><p className="prism-card__eyebrow">Coverage</p><strong className="prism-card__metric">92<span>%</span></strong><Progress label="Variant photo coverage" value={92} /><p className="prism-card__note">23 products became clearer this week.</p></Card>
            <Card accent="clay"><div className="prism-card__top"><p className="prism-card__eyebrow">Attention</p><StatusBadge tone="warning">3 items</StatusBadge></div><h3>Names waiting for a color match</h3><p className="prism-card__note">“Oat milk”, “Driftwood”, and “No. 4” need your judgment.</p><Button tone="quiet" size="sm" trailing={<Arrow />}>Review queue</Button></Card>
            <Card accent="blush"><p className="prism-card__eyebrow">Live selection</p><div className="prism-pigment-row" aria-label="Available colors"><i /><i /><i /><i /><i /></div><h3>Palette stays tangible</h3><p className="prism-card__note">Color is always accompanied by a legible name and state.</p></Card>
          </div>
        </section>

        <section id="feedback" className="prism-section prism-section--split" aria-labelledby="feedback-title">
          <div className="prism-section__heading"><p className="prism-kicker">04 / Feedback</p><h2 id="feedback-title">States should feel unmissable, not loud.</h2><p>Use in-place progress for work, toasts for confirmations, and a focused dialog only when a decision is needed.</p></div>
          <Card accent="none" className="prism-feedback-card"><Progress label="AI mapping photos to colors" value={64} /><div className="prism-feedback-card__content"><div><StatusBadge tone="success">Complete</StatusBadge><h3>17 photo matches applied</h3><p>The gallery is ready to review before it reaches your storefront.</p></div><Button onClick={() => setDialogOpen(true)} trailing={<Arrow />}>Review changes</Button></div></Card>
        </section>

        <footer className="prism-footer"><span>Prism UI / Varn</span><span>Tokens · components · interaction patterns</span></footer>
      </main>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Review 17 photo matches"><p>Each match has a confidence score and can be edited before publishing. This dialog uses escape-to-close and click-away dismissal.</p></Dialog>
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
