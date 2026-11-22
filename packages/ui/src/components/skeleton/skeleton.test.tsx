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
  });
});
