/**
 * PromptQueue 行为规约：验证空队列隐藏、折叠切换、暂停续发、立即插队发送、编辑取回与单条移除。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PromptQueue, type QueuedPromptItem } from "../../index.js";

afterEach(cleanup);

const ITEMS: QueuedPromptItem[] = [
  { id: "q1", content: "顺便补充深色主题下的边框对比度数据", priority: "high" },
  { id: "q2", content: "导出对应的 Vitest 测试用例", meta: "1 个附件" },
];

describe("PromptQueue", () => {
  it("队列为空时不渲染任何节点", () => {
    const { container } = render(<PromptQueue items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("展示排队条数并触发立即插队发送、编辑回填、移除与折叠收起", async () => {
    const user = userEvent.setup();
    const onSendNow = vi.fn<(item: QueuedPromptItem) => void>();
    const onEdit = vi.fn<(item: QueuedPromptItem) => void>();
    const onRemove = vi.fn<(id: string) => void>();

    render(
      <PromptQueue
        items={ITEMS}
        variant="glass"
        onSendNow={onSendNow}
        onEdit={onEdit}
        onRemove={onRemove}
      />,
    );

    expect(screen.getByText(/2 条待发送/)).toBeTruthy();
    expect(screen.getByText("优先")).toBeTruthy();
    expect(document.querySelector('[data-slot="prompt-queue"]')?.getAttribute("data-variant")).toBe(
      "glass",
    );

    await user.click(screen.getAllByRole("button", { name: /立即插队发送/ })[0]!);
    expect(onSendNow).toHaveBeenCalledWith(ITEMS[0]);

    await user.click(screen.getAllByRole("button", { name: /编辑待发消息/ })[0]!);
    expect(onEdit).toHaveBeenCalledWith(ITEMS[0]);

    await user.click(screen.getAllByRole("button", { name: /移除待发消息/ })[1]!);
    expect(onRemove).toHaveBeenCalledWith("q2");

    await user.click(screen.getByRole("button", { name: /条待发送/ }));
    expect(screen.queryByText("顺便补充深色主题下的边框对比度数据")).toBeNull();
  });

  it("支持暂停/恢复自动发出回调与清空队列操作", async () => {
    const user = userEvent.setup();
    const onTogglePause = vi.fn<() => void>();
    const onClearAll = vi.fn<() => void>();

    render(
      <PromptQueue items={ITEMS} paused onTogglePause={onTogglePause} onClearAll={onClearAll} />,
    );

    expect(document.querySelector('[data-slot="prompt-queue"]')?.getAttribute("data-paused")).toBe(
      "true",
    );
    await user.click(screen.getByRole("button", { name: "恢复" }));
    expect(onTogglePause).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "清空" }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
});
