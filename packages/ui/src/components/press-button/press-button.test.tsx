/**
 * PressButton 的行为规约。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PressButton } from "../../index.js";

afterEach(cleanup);

describe("PressButton", () => {
  it("将 pressStrength 限制在 0.01 到 0.06 之间并写入 --press-scale", () => {
    render(
      <>
        <PressButton pressStrength={0.5}>过强</PressButton>
        <PressButton pressStrength={0}>过弱</PressButton>
      </>,
    );

    const strong = screen.getByRole("button", { name: "过强" });
    const weak = screen.getByRole("button", { name: "过弱" });

    expect(strong.style.getPropertyValue("--press-scale")).toBe("0.94");
    expect(weak.style.getPropertyValue("--press-scale")).toBe("0.99");
  });

  it("支持 elevation、fullWidth 并透传 Button 的 variant 与点击回调", async () => {
    const onClick = vi.fn<() => void>();
    render(
      <PressButton variant="signal" elevation="flat" fullWidth radius="pill" onClick={onClick}>
        确认发布
      </PressButton>,
    );
    const button = screen.getByRole("button", { name: "确认发布" });

    expect(button.getAttribute("data-slot")).toBe("press-button");
    expect(button.getAttribute("data-elevation")).toBe("flat");
    expect(button.getAttribute("data-variant")).toBe("signal");
    expect(button.getAttribute("data-radius")).toBe("pill");
    expect(button.className).toContain("w-full");

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
