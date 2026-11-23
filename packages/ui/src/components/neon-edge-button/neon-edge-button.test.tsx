/**
 * NeonEdgeButton 的行为规约。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NeonEdgeButton } from "../../index.js";

afterEach(cleanup);

describe("NeonEdgeButton", () => {
  it("渲染隐藏的边缘光节点并根据 speed 计算旋转周期", () => {
    render(<NeonEdgeButton speed={1.5}>部署预览</NeonEdgeButton>);
    const button = screen.getByRole("button", { name: "部署预览" });
    const light = button.querySelector<HTMLSpanElement>('[data-slot="neon-edge-light"]');

    expect(light?.getAttribute("aria-hidden")).toBe("true");
    expect(light?.style.animationDuration).toBe("2s");
  });

  it("支持 variant、tone、size、radius 并正常响应点击", async () => {
    const onClick = vi.fn<() => void>();
    render(
      <NeonEdgeButton variant="surface" tone="emerald" size="lg" radius="default" onClick={onClick}>
        生成报告
      </NeonEdgeButton>,
    );
    const button = screen.getByRole("button", { name: "生成报告" });

    expect(button.getAttribute("data-variant")).toBe("surface");
    expect(button.getAttribute("data-tone")).toBe("emerald");
    expect(button.getAttribute("data-size")).toBe("lg");
    expect(button.getAttribute("data-radius")).toBe("default");

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
