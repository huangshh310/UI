/**
 * MagneticButton 的行为规约。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MagneticButton } from "../../index.js";

afterEach(cleanup);

describe("MagneticButton", () => {
  it("渲染原生按钮与磁吸包裹层，透传 variant、size、radius 与点击回调", async () => {
    const onClick = vi.fn<() => void>();
    render(
      <MagneticButton variant="signal" size="lg" radius="default" strength={0.5} onClick={onClick}>
        探索工作台
      </MagneticButton>,
    );

    const button = screen.getByRole("button", { name: "探索工作台" });
    const wrapper = button.closest('[data-slot="magnetic-button"]');

    expect(wrapper?.getAttribute("data-variant")).toBe("signal");
    expect(wrapper?.getAttribute("data-size")).toBe("lg");
    expect(wrapper?.getAttribute("data-radius")).toBe("default");

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 为真时禁用内部按钮且不触发点击", async () => {
    const onClick = vi.fn<() => void>();
    render(
      <MagneticButton disabled onClick={onClick}>
        已禁用
      </MagneticButton>,
    );

    const button = screen.getByRole("button", { name: "已禁用" });
    expect(button.hasAttribute("disabled")).toBe(true);
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
