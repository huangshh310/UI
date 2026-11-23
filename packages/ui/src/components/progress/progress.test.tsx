import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Progress } from "../../index.js";

afterEach(cleanup);

describe("Progress", () => {
  it("渲染确定进度与百分比读数", () => {
    render(<Progress value={68} label="同步进度" showValue />);

    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("68");
    expect(screen.getByText("同步进度")).toBeTruthy();
    expect(screen.getByText("68%")).toBeTruthy();
  });

  it("支持 null 与 indeterminate 不确定加载状态", () => {
    const { rerender } = render(<Progress value={null} label="正在校验" />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBeNull();
    expect(bar.getAttribute("data-indeterminate")).toBe("true");

    rerender(<Progress indeterminate tone="warning" size="lg" label="正在索引" />);
    const nextBar = screen.getByRole("progressbar");
    expect(nextBar.getAttribute("aria-valuenow")).toBeNull();
    expect(nextBar.getAttribute("data-tone")).toBe("warning");
    expect(nextBar.getAttribute("data-size")).toBe("lg");
  });

  it("支持 default / destructive 色调且缺省 label 时仍具无障碍名称", () => {
    render(<Progress value={92} tone="destructive" size="md" />);
    const bar = screen.getByRole("progressbar", { name: "进度" });
    expect(bar.getAttribute("data-tone")).toBe("destructive");
    expect(bar.getAttribute("data-size")).toBe("md");
  });
});
