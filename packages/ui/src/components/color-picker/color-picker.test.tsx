/**
 * ColorPicker 行为规约：验证色盘与色相滑轨渲染、预设色板选择、CSS 色值输入校验回退与 OKLCH/透明度扩展。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ColorPicker } from "../../index.js";

beforeAll(() => {
  if (typeof Element !== "undefined") {
    Element.prototype.getAnimations ??= () => [];
    Element.prototype.scrollIntoView ??= () => {};
  }
  if (typeof HTMLCanvasElement !== "undefined") {
    HTMLCanvasElement.prototype.getContext = (() =>
      null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  }
});

afterEach(cleanup);

const PRESET_SWATCHES = ["#ef4444", "#22c55e", "#7a5ee4", "#a855f7"];

describe("ColorPicker", () => {
  it("渲染预设色板与色值输入框，点击预设色块或输入合法色值回车后触发变更与确认回调", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(val: string) => void>();
    const onValueCommit = vi.fn<(val: string) => void>();

    const { container } = render(
      <ColorPicker
        label="品牌主色"
        defaultValue="#7a5ee4"
        presets={PRESET_SWATCHES}
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
      />,
    );

    const swatchItems = container.querySelectorAll('[data-slot="color-picker-swatch-item"]');
    expect(swatchItems.length).toBe(4);

    await user.click(swatchItems[0] as HTMLElement);
    expect(onValueChange).toHaveBeenCalledWith("#ef4444");
    expect(onValueCommit).toHaveBeenCalledWith("#ef4444");

    const hexInput = screen.getByRole("textbox", { name: "颜色值输入" }) as HTMLInputElement;
    await user.clear(hexInput);
    await user.type(hexInput, "#22c55e{Enter}");
    expect(onValueCommit).toHaveBeenLastCalledWith("#22c55e");
  });

  it("在输入框键入非法色值字符串并回车时自动回退至上一个有效颜色", async () => {
    const user = userEvent.setup();

    render(<ColorPicker ariaLabel="主题强调色" defaultValue="#7a5ee4" />);

    const hexInput = screen.getByRole("textbox", { name: "颜色值输入" }) as HTMLInputElement;
    expect(hexInput.value.toLowerCase()).toBe("#7a5ee4");

    await user.clear(hexInput);
    await user.type(hexInput, "not-a-valid-color{Enter}");
    expect(hexInput.value.toLowerCase()).toBe("#7a5ee4");
  });

  it("支持 oklch 色彩空间画布挂载与透明度滑轨开关", () => {
    const { container } = render(
      <ColorPicker
        ariaLabel="感知均匀色盘"
        space="oklch"
        defaultValue="oklch(0.62 0.19 259)"
        showAlpha
        showChannelInputs
      />,
    );

    expect(container.querySelector('[data-slot="color-picker-area-canvas"]')).toBeTruthy();
    expect(
      container.querySelector('[data-slot="color-picker-slider"][data-channel="alpha"]'),
    ).toBeTruthy();
    expect(
      container.querySelectorAll('[data-slot="color-picker-channel-input"]').length,
    ).toBeGreaterThanOrEqual(3);
  });
});
