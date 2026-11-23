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

  it("支持 soft 柔和变体、sm 尺寸与呼吸脉冲圆点", () => {
    render(
      <Badge variant="soft" size="sm" dot pulse>
        实时同步
      </Badge>,
    );

    const badge = screen.getByText("实时同步").closest('[data-slot="badge"]');
    expect(badge?.getAttribute("data-variant")).toBe("soft");
    expect(badge?.getAttribute("data-size")).toBe("sm");
    expect(badge?.querySelector('[data-slot="badge-dot"]')).toBeTruthy();
  });
});
