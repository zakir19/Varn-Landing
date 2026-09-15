import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ActivityTimeline,
  FeedbackPrompt,
  Notice,
  Price,
  ProductCard,
  QuantityStepper,
  Rating,
  VariantPicker,
} from "./commerce-feedback";

describe("Prism commerce and feedback", () => {
  it("communicates a reduced price without relying on its visual treatment", () => {
    const markup = renderToStaticMarkup(<Price amount={72} compareAt={90} currency="USD" />);
    expect(markup).toContain("reduced from");
    expect(markup).toContain("<del");
  });

  it("uses native radio controls for product options", () => {
    const markup = renderToStaticMarkup(
      <VariantPicker label="Finish" value="clay" onChange={() => undefined} options={[
        { value: "clay", label: "Clay", swatch: "#cc5b37" },
        { value: "violet", label: "Violet", disabled: true },
      ]} display="swatches" />,
    );
    expect(markup).toContain('type="radio"');
    expect(markup).toContain("Unavailable");
  });

  it("bounds quantity controls and gives their buttons useful names", () => {
    const markup = renderToStaticMarkup(<QuantityStepper value={1} min={1} max={3} onChange={() => undefined} label="Copies" />);
    expect(markup).toContain('aria-label="Decrease Copies"');
    expect(markup).toContain("disabled");
  });

  it("renders product and feedback content as independently labelled surfaces", () => {
    const product = renderToStaticMarkup(<ProductCard name="Field Notes" price={24} onAction={() => undefined} badge="New ink" />);
    const feedback = renderToStaticMarkup(<Notice tone="success" title="Saved">Your response is in.</Notice>);
    expect(product).toContain("View Field Notes");
    expect(feedback).toContain('role="status"');
  });

  it("exposes activity timing, ratings and score inputs semantically", () => {
    const activity = renderToStaticMarkup(<ActivityTimeline items={[{ id: "1", title: "Edition packed", time: "Today", dateTime: "2026-09-10" }]} />);
    const rating = renderToStaticMarkup(<Rating value={4.5} count={12} />);
    const prompt = renderToStaticMarkup(<FeedbackPrompt value={4} onChange={() => undefined} />);
    expect(activity).toContain('datetime="2026-09-10"');
    expect(rating).toContain("4.5 out of 5");
    expect(prompt).toContain('type="radio"');
  });
});
