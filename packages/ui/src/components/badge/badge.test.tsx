import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Badge } from "../../index.js";

afterEach(cleanup);

describe("Badge", () => {
  it("渲染对应语义变体与状态小圆点", () => {
    render(
      <Badge variant="signal" dot>
        生产运行中
      </Badge>,
    );

    const badge = screen.getByText("生产运行中").closest('[data-slot="badge"]');
    expect(badge?.getAttribute("data-variant")).toBe("signal");
    expect(badge?.querySelector('[data-slot="badge-dot"]')).toBeTruthy();
  });
});
