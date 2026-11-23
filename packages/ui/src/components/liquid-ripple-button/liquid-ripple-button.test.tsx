/**
 * LiquidRippleButton 的行为规约。
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LiquidRippleButton } from "../../index.js";

afterEach(cleanup);

describe("LiquidRippleButton", () => {
  it("按下时在按钮内生成波纹节点，并保持对辅助技术隐藏", () => {
    render(<LiquidRippleButton>点击波纹</LiquidRippleButton>);
    const button = screen.getByRole("button", { name: "点击波纹" });

    fireEvent.pointerDown(button, { clientX: 24, clientY: 16 });
    const ripples = button.querySelectorAll('[data-slot="ripple"]');

    expect(ripples).toHaveLength(1);
    expect(ripples[0]?.getAttribute("aria-hidden")).toBe("true");
  });

  it("支持 variant、size、radius 与自定义 rippleColor，并正常触发点击回调", async () => {
    const onClick = vi.fn<() => void>();
    render(
      <LiquidRippleButton
        variant="signal"
        size="lg"
        radius="default"
        rippleColor="rgba(255,255,255,0.6)"
        onClick={onClick}
      >
        运行构建
      </LiquidRippleButton>,
    );
    const button = screen.getByRole("button", { name: "运行构建" });

    expect(button.getAttribute("data-variant")).toBe("signal");
    expect(button.getAttribute("data-size")).toBe("lg");
    expect(button.getAttribute("data-radius")).toBe("default");

    fireEvent.pointerDown(button, { clientX: 12, clientY: 12 });
    const ripple = button.querySelector<HTMLSpanElement>('[data-slot="ripple"]');
    expect(ripple?.style.backgroundColor).toBe("rgba(255, 255, 255, 0.6)");

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
