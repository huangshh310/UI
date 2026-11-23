/**
 * Conversation 行为规约：验证贴底滚动检测、离开底部浮现回到底部按钮、图标变体与空状态渲染。
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "../../index.js";

afterEach(cleanup);

const mockScrollMetrics = (
  el: HTMLElement,
  metrics: { scrollTop: number; scrollHeight: number; clientHeight: number },
) => {
  Object.defineProperty(el, "scrollTop", {
    value: metrics.scrollTop,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(el, "scrollHeight", { value: metrics.scrollHeight, configurable: true });
  Object.defineProperty(el, "clientHeight", { value: metrics.clientHeight, configurable: true });
};

describe("Conversation", () => {
  it("默认贴底时不显示回到底部按钮；用户上滚离开底部后浮现按钮并可点击归位", async () => {
    const user = userEvent.setup();
    const onAtBottomChange = vi.fn<(atBottom: boolean) => void>();

    render(
      <Conversation variant="surface" fadeEdges unreadCount={2} onAtBottomChange={onAtBottomChange}>
        <ConversationContent size="sm">
          <div>第一条回复</div>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>,
    );

    expect(screen.queryByRole("button", { name: /回到底部/ })).toBeNull();
    expect(document.querySelector('[data-slot="conversation"]')?.getAttribute("data-variant")).toBe(
      "surface",
    );

    const viewport = document.querySelector('[data-slot="conversation-viewport"]') as HTMLElement;
    const scrollToSpy = vi.fn<(options?: ScrollToOptions | number, y?: number) => void>();
    viewport.scrollTo = scrollToSpy as HTMLElement["scrollTo"];
    mockScrollMetrics(viewport, { scrollTop: 40, scrollHeight: 600, clientHeight: 300 });

    fireEvent.scroll(viewport);
    expect(onAtBottomChange).toHaveBeenCalledWith(false);

    const scrollBtn = screen.getByRole("button", { name: /回到底部/ });
    expect(scrollBtn.textContent).toContain("2");

    await user.click(scrollBtn);
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 600, behavior: "smooth" });
  });

  it("ConversationEmptyState 支持 badge 与插槽子内容，ScrollButton 支持 icon 极简圆形态", () => {
    render(
      <Conversation variant="glass" unreadCount={3}>
        <ConversationContent>
          <ConversationEmptyState
            badge="Claude 4.5 · 200K"
            title="你好，今天想构建什么？"
            description="支持流式推理与代码审阅"
          >
            <button type="button">示例提示词</button>
          </ConversationEmptyState>
        </ConversationContent>
        <ConversationScrollButton variant="icon" forceVisible />
      </Conversation>,
    );

    expect(screen.getByText("Claude 4.5 · 200K")).toBeTruthy();
    expect(screen.getByText("你好，今天想构建什么？")).toBeTruthy();
    expect(screen.getByRole("button", { name: "示例提示词" })).toBeTruthy();
    const iconBtn = screen.getByRole("button", { name: "回到底部（3 条新消息）" });
    expect(iconBtn.getAttribute("data-variant")).toBe("icon");
  });
});
