/**
 * LiquidToggle 的行为规约。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LiquidToggle } from "../../index.js";

afterEach(cleanup);

describe("LiquidToggle", () => {
  it("非受控模式下点击与空格键均可切换 aria-checked 与 data-state", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(
      <LiquidToggle
        aria-label="桌面通知"
        defaultChecked
        size="lg"
        tone="emerald"
        variant="subtle"
        onCheckedChange={onCheckedChange}
      />,
    );

    const toggle = screen.getByRole("switch", { name: "桌面通知" });
    expect(toggle.getAttribute("aria-checked")).toBe("true");
    expect(toggle.getAttribute("data-state")).toBe("on");
    expect(toggle.getAttribute("data-size")).toBe("lg");
    expect(toggle.getAttribute("data-tone")).toBe("emerald");
    expect(toggle.getAttribute("data-variant")).toBe("subtle");

    await userEvent.click(toggle);
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);

    toggle.focus();
    await userEvent.keyboard(" ");
    expect(toggle.getAttribute("aria-checked")).toBe("true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
  });

  it("受控模式下由外部 checked 决定状态，disabled 时不响应切换", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(
      <LiquidToggle
        aria-label="自动更新"
        checked={false}
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    const toggle = screen.getByRole("switch", { name: "自动更新" });
    await userEvent.click(toggle);
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
