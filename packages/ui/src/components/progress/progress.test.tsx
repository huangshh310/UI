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

  it("支持 null 不确定加载状态", () => {
    render(<Progress value={null} label="正在校验" />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBeNull();
  });
});
