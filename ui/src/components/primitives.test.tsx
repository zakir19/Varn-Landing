import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button, Progress, StatusBadge } from "./primitives";

describe("Prism primitives", () => {
  it("renders a disabled loading button accessibly", () => {
    const markup = renderToStaticMarkup(<Button loading>Saving</Button>);
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain("disabled");
  });

  it("keeps progress within its accessible range", () => {
    const markup = renderToStaticMarkup(<Progress label="Coverage" value={140} />);
    expect(markup).toContain('aria-valuenow="100"');
  });

  it("renders semantic status names", () => {
    const markup = renderToStaticMarkup(<StatusBadge tone="success">Ready</StatusBadge>);
    expect(markup).toContain("Ready");
    expect(markup).toContain("prism-badge--success");
  });
});
