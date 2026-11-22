import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SpotlightCard } from "../../index.js";

afterEach(cleanup);

describe("SpotlightCard", () => {
  it("渲染内容并在指针移动时更新局部高光坐标 CSS 变量", () => {
    render(
      <SpotlightCard>
        <p>径向高光卡片</p>
      </SpotlightCard>,
    );

    const card = screen
      .getByText("径向高光卡片")
      .closest('[data-slot="spotlight-card"]') as HTMLElement;
    expect(card).toBeTruthy();

    fireEvent.pointerMove(card, { clientX: 80, clientY: 40 });
    expect(card.style.getPropertyValue("--spot-x")).toBe("80px");
    expect(card.style.getPropertyValue("--spot-y")).toBe("40px");
  });

  it("将 children 直接挂载在卡片根节点下以保留调用方的 flex/grid 布局", () => {
    render(
      <SpotlightCard className="flex flex-row items-center gap-4">
        <span>左侧标题</span>
        <span>右侧指标</span>
      </SpotlightCard>,
    );

    const card = screen.getByText("左侧标题").closest('[data-slot="spotlight-card"]');
    expect(screen.getByText("左侧标题").parentElement).toBe(card);
    expect(screen.getByText("右侧指标").parentElement).toBe(card);
  });
});
