import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ThinkingOrb } from "../../index.js";

afterEach(cleanup);

describe("ThinkingOrb", () => {
  it("按认知状态与尺寸渲染可访问的球面粒子画布", () => {
    render(<ThinkingOrb state="searching" size={80} paused />);

    const orb = screen.getByRole("status", { name: "智能体状态球：检索中" });
    expect(orb.getAttribute("data-slot")).toBe("thinking-orb");
    expect(orb.getAttribute("data-state")).toBe("searching");
    expect(orb.getAttribute("data-variant")).toBe("minimal");
    expect(orb.style.width).toBe("80px");
    expect(orb.querySelector("canvas")).toBeTruthy();
  });

  it("支持自定义 aria-label 与明暗极性控制", () => {
    render(<ThinkingOrb state="listening" dark={false} paused aria-label="语音聆听中" />);

    expect(screen.getByRole("status", { name: "语音聆听中" })).toBeTruthy();
  });

  it("支持 framed/halo 变体、状态文案胶囊与脉冲指示点", () => {
    render(
      <ThinkingOrb
        state="solving"
        variant="framed"
        size={64}
        showLabel
        labelPlacement="right"
        paused
      />,
    );

    const orb = screen.getByRole("status", { name: "智能体状态球：求解中" });
    expect(orb.getAttribute("data-variant")).toBe("framed");
    expect(orb.querySelector('[data-slot="thinking-orb-frame"]')).toBeTruthy();
    const label = orb.querySelector('[data-slot="thinking-orb-label"]');
    expect(label?.textContent).toContain("求解中");
    expect(orb.querySelector('[data-slot="thinking-orb-indicator"]')).toBeTruthy();
  });

  it("在切换认知状态与 halo 变体时保持画布节点稳定并更新状态属性", () => {
    const { rerender } = render(<ThinkingOrb state="working" variant="halo" size={96} paused />);

    const orb = screen.getByRole("status", { name: "智能体状态球：处理中" });
    const canvasBefore = orb.querySelector("canvas");
    expect(orb.getAttribute("data-variant")).toBe("halo");

    rerender(<ThinkingOrb state="shaping" variant="halo" size={96} paused />);

    const updated = screen.getByRole("status", { name: "智能体状态球：构思塑形" });
    expect(updated.getAttribute("data-state")).toBe("shaping");
    expect(updated.querySelector("canvas")).toBe(canvasBefore);
  });
});
