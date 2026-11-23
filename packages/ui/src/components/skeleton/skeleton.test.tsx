import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Skeleton } from "../../index.js";

afterEach(cleanup);

describe("Skeleton", () => {
  it("支持 pulse 与 shimmer 两种形态并附带 aria-hidden", () => {
    const { container } = render(<Skeleton variant="shimmer" shape="circle" className="size-10" />);
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el?.getAttribute("aria-hidden")).toBe("true");
    expect(el?.getAttribute("data-variant")).toBe("shimmer");
    expect(el?.getAttribute("data-shape")).toBe("circle");
  });

  it("支持 text / card / rounded 预设几何形态", () => {
    const { container } = render(
      <div>
        <Skeleton shape="text" />
        <Skeleton shape="card" variant="shimmer" />
        <Skeleton shape="rounded" />
      </div>,
    );

    const els = container.querySelectorAll('[data-slot="skeleton"]');
    expect(els[0]?.getAttribute("data-shape")).toBe("text");
    expect(els[1]?.getAttribute("data-shape")).toBe("card");
    expect(els[2]?.getAttribute("data-shape")).toBe("rounded");
  });
});
