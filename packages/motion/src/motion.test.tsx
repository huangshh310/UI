/**
 * @matt-ui/motion 各组件的行为规约。
 *
 * 测试接缝：包的公开入口。只覆盖组件自己做出的状态与可访问性决定；
 * 弹簧、拖拽、磁吸这些手感由展示站的端到端测试在真实浏览器中检查。
 */
import { act, cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DragToConfirm,
  LiquidToggle,
  MagneticButton,
  MorphingButton,
  OtpInput,
  StretchSwitch,
} from "./index.js";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("LiquidToggle", () => {
  it("是一个开关，点击在开与关之间切换并通知新值", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(<LiquidToggle aria-label="通知" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole("switch", { name: "通知" });
    expect(toggle.getAttribute("aria-checked")).toBe("false");

    await userEvent.click(toggle);

    expect(toggle.getAttribute("aria-checked")).toBe("true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("受控时只由外部的 checked 决定状态", async () => {
    render(<LiquidToggle aria-label="通知" checked={false} onCheckedChange={() => {}} />);

    await userEvent.click(screen.getByRole("switch"));

    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("false");
  });
});

describe("MorphingButton", () => {
  it("可访问名称跟随状态变化", () => {
    const { rerender } = render(<MorphingButton status="idle" />);
    expect(screen.getByRole("button", { name: "Save changes" })).toBeTruthy();

    rerender(<MorphingButton status="success" />);

    expect(screen.getByRole("button", { name: "Saved" })).toBeTruthy();
  });

  it("加载中声明忙碌，并且不会再次触发 onClick", async () => {
    const onClick = vi.fn<() => void>();
    render(<MorphingButton status="loading" onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Saving…" });

    await userEvent.click(button);

    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("DragToConfirm", () => {
  it("键盘用户按 Enter 即可确认，确认结果会被播报", async () => {
    const onConfirm = vi.fn<() => void>();
    render(<DragToConfirm label="滑动删除" confirmedLabel="已删除" onConfirm={onConfirm} />);

    screen.getByRole("button", { name: /滑动删除/ }).focus();
    await userEvent.keyboard("{Enter}");

    expect(onConfirm).toHaveBeenCalledTimes(1);
    // 确认文字既显示在轨道上，也通过播报区告知屏幕阅读器
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe("已删除");
  });

  it("确认后经过 autoResetDelay 自动复位并调用 onReset", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onReset = vi.fn<() => void>();
    render(<DragToConfirm label="滑动删除" autoResetDelay={1000} onReset={onReset} />);

    screen.getByRole("button", { name: /滑动删除/ }).focus();
    await userEvent.keyboard("{Enter}");
    act(() => vi.advanceTimersByTime(1100));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /滑动删除/ })).toBeTruthy();
  });

  it("禁用时按 Enter 不会确认", async () => {
    const onConfirm = vi.fn<() => void>();
    render(<DragToConfirm label="滑动删除" disabled onConfirm={onConfirm} />);

    screen.getByRole("button", { name: /滑动删除/ }).focus();
    await userEvent.keyboard("{Enter}");

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("默认在确认时触发震动反馈，haptics 为假时不震动", async () => {
    const vibrate = vi.fn<(pattern: VibratePattern) => boolean>(() => true);
    const original = Object.getOwnPropertyDescriptor(Navigator.prototype, "vibrate");
    Object.defineProperty(navigator, "vibrate", { value: vibrate, configurable: true });

    try {
      render(<DragToConfirm label="滑动删除" autoResetDelay={0} />);
      screen.getByRole("button", { name: /滑动删除/ }).focus();
      await userEvent.keyboard("{Enter}");
      expect(vibrate).toHaveBeenCalledTimes(1);

      vibrate.mockClear();
      cleanup();

      render(<DragToConfirm label="静默删除" haptics={false} autoResetDelay={0} />);
      screen.getByRole("button", { name: /静默删除/ }).focus();
      await userEvent.keyboard("{Enter}");
      expect(vibrate).not.toHaveBeenCalled();
    } finally {
      if (original) {
        Object.defineProperty(Navigator.prototype, "vibrate", original);
      } else {
        Reflect.deleteProperty(navigator, "vibrate");
      }
    }
  });
});

describe("MagneticButton", () => {
  it("是一个普通按钮，点击照常触发", async () => {
    const onClick = vi.fn<() => void>();
    render(<MagneticButton onClick={onClick}>Launch</MagneticButton>);

    await userEvent.click(screen.getByRole("button", { name: "Launch" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("StretchSwitch", () => {
  it("点击标签或开关可在开关状态间切换并通知 onCheckedChange", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(<StretchSwitch label="自动保存" onCheckedChange={onCheckedChange} />);

    const sw = screen.getByRole("switch", { name: "自动保存" });
    expect(sw.getAttribute("aria-checked")).toBe("false");

    await userEvent.click(screen.getByText("自动保存"));
    expect(sw.getAttribute("aria-checked")).toBe("true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);

    sw.focus();
    await userEvent.keyboard(" ");
    expect(sw.getAttribute("aria-checked")).toBe("false");
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it("受控模式下由外部 checked 决定，禁用时不可切换", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(
      <>
        <StretchSwitch label="受控开关" checked={false} onCheckedChange={onCheckedChange} />
        <StretchSwitch label="禁用开关" disabled onCheckedChange={onCheckedChange} />
      </>,
    );

    await userEvent.click(screen.getByRole("switch", { name: "受控开关" }));
    expect(screen.getByRole("switch", { name: "受控开关" }).getAttribute("aria-checked")).toBe(
      "false",
    );
    expect(onCheckedChange).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("switch", { name: "禁用开关" }));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
  });
});

describe("OtpInput", () => {
  it("逐位输入数字自动推进，填满后触发 onComplete，非数字被拒绝", async () => {
    const onComplete = vi.fn<(value: string) => void>();
    const onValueChange = vi.fn<(value: string) => void>();
    render(
      <OtpInput label="验证码" length={4} onValueChange={onValueChange} onComplete={onComplete} />,
    );

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4);

    await userEvent.click(inputs[0]!);
    await userEvent.keyboard("1a234");

    expect(onComplete).toHaveBeenCalledWith("1234");
    expect(onValueChange).toHaveBeenLastCalledWith("1234");
  });

  it("粘贴完整验证码一次性填满所有位并触发 onComplete", async () => {
    const onComplete = vi.fn<(value: string) => void>();
    render(<OtpInput aria-label="安全码" length={6} separatorAt={3} onComplete={onComplete} />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);

    await userEvent.click(inputs[0]!);
    await userEvent.paste("842916");

    expect(onComplete).toHaveBeenCalledWith("842916");
  });
});
