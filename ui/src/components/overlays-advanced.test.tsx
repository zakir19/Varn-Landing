import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { InlineNotice, Tooltip } from "./overlays-advanced";

describe("advanced overlay primitives", () => {
  it("connects tooltip text to its trigger", () => {
    const markup = renderToStaticMarkup(<Tooltip label="Helpful context"><button type="button">Info</button></Tooltip>);
    expect(markup).toContain("aria-describedby");
    expect(markup).toContain("Helpful context");
  });

  it("uses semantic tone for notices", () => {
    expect(renderToStaticMarkup(<InlineNotice tone="warning" title="Heads up" />)).toContain("prism-inline-notice--warning");
  });
});
