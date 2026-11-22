/**
 * TypewriterButton 的行为规约。
 *
 * 测试接缝：@matt-ui/ui 的公开入口。
 * 只覆盖逐字显示这件事本身的规则；视觉效果由展示站的端到端测试在真实浏览器中检查。
 */
import { act, cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TypewriterButton } from "../../index.js";

/** 按钮里当前可见的文字 */
const visibleText = () => screen.getByTestId("typewriter-text").textContent;

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("TypewriterButton", () => {
  it("点击后从头开始逐字显示，每个字符间隔 charDuration", async () => {
    render(<TypewriterButton label="Deploy" charDuration={100} />);
    expect(visibleText()).toBe("Deploy");

    await userEvent.click(screen.getByRole("button"));
    expect(visibleText()).toBe("");

    act(() => vi.advanceTimersByTime(300));
    expect(visibleText()).toBe("Dep");
  });

  it("全部显示完后调用一次 onComplete", async () => {
    const onComplete = vi.fn<() => void>();
    render(<TypewriterButton label="Go" charDuration={50} onComplete={onComplete} />);

    await userEvent.click(screen.getByRole("button"));
    act(() => vi.advanceTimersByTime(500));

    expect(visibleText()).toBe("Go");
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("打字过程中可访问名称始终是完整的文字", async () => {
    render(<TypewriterButton label="Deploy" charDuration={100} />);

    await userEvent.click(screen.getByRole("button"));
    act(() => vi.advanceTimersByTime(200));

    expect(screen.getByRole("button", { name: "Deploy" })).toBeTruthy();
  });

  it("autoStart 为真时挂载后立即开始打字", () => {
    render(<TypewriterButton label="Deploy" charDuration={100} autoStart />);

    act(() => vi.advanceTimersByTime(200));

    expect(visibleText()).toBe("De");
  });

  it("默认在每个非空白字符打出时通过 Web Audio 合成按键音，卸载时关闭音频上下文", async () => {
    const startOsc = vi.fn<() => void>();
    const close = vi.fn<() => Promise<void>>(() => Promise.resolve());
    const resume = vi.fn<() => Promise<void>>(() => Promise.resolve());
    class MockAudioContext {
      state = "running";
      currentTime = 0;
      sampleRate = 44100;
      destination = {};
      resume = resume;
      close = close;
      createBuffer = () => ({ getChannelData: () => new Float32Array(512) });
      createBufferSource = () => ({
        buffer: null,
        connect: vi.fn<() => void>(),
        start: startOsc,
        stop: vi.fn<() => void>(),
      });
      createBiquadFilter = () => ({
        type: "bandpass",
        frequency: { value: 0 },
        Q: { value: 0 },
        connect: vi.fn<() => void>(),
      });
      createGain = () => ({
        gain: {
          setValueAtTime: vi.fn<() => void>(),
          exponentialRampToValueAtTime: vi.fn<() => void>(),
        },
        connect: vi.fn<() => void>(),
      });
    }
    vi.stubGlobal("AudioContext", MockAudioContext);

    try {
      const { unmount } = render(<TypewriterButton label="A B" charDuration={50} />);

      await userEvent.click(screen.getByRole("button"));
      act(() => vi.advanceTimersByTime(250));

      // "A B" 中有 2 个非空白字符，空格不发声
      expect(startOsc).toHaveBeenCalledTimes(2);
      unmount();
      expect(close).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("sound 为假时不会创建 AudioContext 也不播放音效", async () => {
    const ctor = vi.fn<() => void>();
    vi.stubGlobal("AudioContext", function MockAudioContext() {
      ctor();
    } as unknown as typeof AudioContext);

    try {
      render(<TypewriterButton label="Go" charDuration={50} sound={false} />);

      await userEvent.click(screen.getByRole("button"));
      act(() => vi.advanceTimersByTime(200));

      expect(visibleText()).toBe("Go");
      expect(ctor).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
