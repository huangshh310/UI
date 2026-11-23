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
    expect(orb.style.width).toBe("80px");
    expect(orb.querySelector("canvas")).toBeTruthy();
  });

  it("支持自定义 aria-label 与明暗极性控制", () => {
    render(<ThinkingOrb state="listening" dark={false} paused aria-label="语音聆听中" />);

    expect(screen.getByRole("status", { name: "语音聆听中" })).toBeTruthy();
  });
});
