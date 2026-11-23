import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AnimatedText } from "../../index.js";

afterEach(cleanup);

describe("AnimatedText", () => {
  it("在 reveal 与 shimmer 模式下渲染完整可读文本", () => {
    render(
      <div>
        <AnimatedText text="中性克制 钴蓝聚焦" mode="reveal" />
        <AnimatedText text="正在生成组件源码…" mode="shimmer" />
      </div>,
    );

    expect(screen.getByText("中性克制 钴蓝聚焦")).toBeTruthy();
    expect(screen.getByText("正在生成组件源码…")).toBeTruthy();
  });

  it("支持 variant、tone、size 数据属性及 cycle 短语首帧渲染", () => {
    const { container } = render(
      <div>
        <AnimatedText text="光学聚焦显现" mode="reveal" variant="blur-in" tone="signal" size="lg" />
        <AnimatedText
          mode="cycle"
          variant="wave"
          tone="emerald"
          phrases={["设计系统", "AI 工作台"]}
        />
      </div>,
    );

    const revealEl = container.querySelector('[data-mode="reveal"]');
    expect(revealEl?.getAttribute("data-variant")).toBe("blur-in");
    expect(revealEl?.getAttribute("data-tone")).toBe("signal");
    expect(revealEl?.getAttribute("data-size")).toBe("lg");

    const cycleEl = container.querySelector('[data-mode="cycle"]');
    expect(cycleEl?.getAttribute("data-variant")).toBe("wave");
    expect(cycleEl?.getAttribute("data-tone")).toBe("emerald");
    expect(screen.getByText("设计系统")).toBeTruthy();
  });
});
