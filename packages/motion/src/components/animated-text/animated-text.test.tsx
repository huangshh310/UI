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
});
