import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Separator } from "../../index.js";

afterEach(cleanup);

describe("Separator", () => {
  it("支持水平、垂直方向以及居中文字标签分隔线", () => {
    render(
      <div>
        <Separator label="或使用邮箱继续" />
        <Separator orientation="vertical" />
      </div>,
    );

    expect(screen.getByText("或使用邮箱继续")).toBeTruthy();
    expect(screen.getAllByRole("separator").length).toBeGreaterThanOrEqual(2);
  });

  it("支持左对齐标签与 dashed / gradient 线条变体", () => {
    const { container } = render(
      <div>
        <Separator label="基础设置" labelAlign="left" variant="dashed" />
        <Separator variant="gradient" />
      </div>,
    );

    const labeled = screen.getByText("基础设置").closest('[data-slot="separator"]');
    expect(labeled?.getAttribute("data-align")).toBe("left");
    expect(labeled?.getAttribute("data-variant")).toBe("dashed");
    expect(container.querySelector('[data-variant="gradient"]')).toBeTruthy();
  });
});
