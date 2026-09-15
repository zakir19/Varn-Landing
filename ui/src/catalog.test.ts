import { describe, expect, it } from "vitest";
import { catalogConfigurationCount, componentFamilies } from "./catalog";

describe("Prism catalog", () => {
  it("contains more than 900 documented usable configurations", () => {
    expect(catalogConfigurationCount).toBeGreaterThan(900);
  });

  it("covers foundational, commerce, and accessibility-critical families", () => {
    expect(componentFamilies.map(({ name }) => name)).toEqual(expect.arrayContaining(["Button", "Field", "Dialog", "Swatch", "Stack"]));
  });
});
