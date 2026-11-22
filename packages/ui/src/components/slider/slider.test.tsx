import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Slider } from "../../index.js";

afterEach(cleanup);

describe("Slider", () => {
  it("渲染单滑块与区间双滑块并输出实时数值", () => {
    render(<Slider label="采样率" defaultValue={40} showValue />);
    const slider = screen.getByRole("slider");
    expect(slider.getAttribute("aria-valuenow")).toBe("40");
    expect(screen.getByText("40")).toBeTruthy();

    cleanup();
    render(<Slider label="预算区间" value={[20, 80]} showValue formatValue={(v) => `¥${v}`} />);
    const thumbs = screen.getAllByRole("slider");
    expect(thumbs.length).toBe(2);
    expect(screen.getByText("¥20 – ¥80")).toBeTruthy();
  });
});
