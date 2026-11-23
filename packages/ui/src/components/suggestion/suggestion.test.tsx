/**
 * Suggestion 行为规约：验证胶囊条复合拼装、空态灵感卡片分类筛选、垂直追问列表与点击回调。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Suggestion, Suggestions } from "../../index.js";

afterEach(cleanup);

describe("Suggestions", () => {
  it("支持复合子部件 Suggestion 拼装并在点击时回传完整建议词", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(prompt: string) => void>();

    render(
      <Suggestions>
        <Suggestion suggestion="解释这段架构决策的权衡" badge="⌘1" onSelect={onSelect}>
          解释架构权衡
        </Suggestion>
        <Suggestion suggestion="补充边界测试" variant="signal" onSelect={onSelect} />
      </Suggestions>,
    );

    await user.click(screen.getByRole("button", { name: /解释架构权衡/ }));
    expect(onSelect).toHaveBeenCalledWith("解释这段架构决策的权衡");

    await user.click(screen.getByRole("button", { name: "补充边界测试" }));
    expect(onSelect).toHaveBeenLastCalledWith("补充边界测试");
  });

  it("variant=cards 支持按分类筛选灵感卡片并回传条目 prompt", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(prompt: string) => void>();

    render(
      <Suggestions
        variant="cards"
        onSelect={onSelect}
        items={[
          {
            id: "1",
            category: "架构",
            label: "审查状态机边界",
            prompt: "请审查当前对话流状态机的边界条件",
          },
          {
            id: "2",
            category: "视觉",
            label: "优化浅色对比度",
            prompt: "请核对浅色主题下的表面阶梯与文字对比度",
          },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "视觉" }));
    expect(screen.queryByText("审查状态机边界")).toBeNull();

    await user.click(screen.getByRole("button", { name: /优化浅色对比度/ }));
    expect(onSelect).toHaveBeenCalledWith(
      "请核对浅色主题下的表面阶梯与文字对比度",
      expect.objectContaining({ id: "2" }),
    );
  });

  it("variant=list 渲染垂直追问列表并触发选中回调", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(prompt: string) => void>();

    render(
      <Suggestions
        variant="list"
        surface="glass"
        onSelect={onSelect}
        items={[
          {
            id: "f1",
            label: "列出受影响的测试文件",
            description: "定位所有依赖该 Token 的单元测试与 E2E 用例",
            prompt: "请列出受影响的测试文件并给出验证顺序",
            badge: "追问",
          },
        ]}
      />,
    );

    const list = document.querySelector('[data-slot="suggestions"]');
    expect(list?.getAttribute("data-variant")).toBe("list");
    await user.click(screen.getByRole("button", { name: /列出受影响的测试文件/ }));
    expect(onSelect).toHaveBeenCalledWith(
      "请列出受影响的测试文件并给出验证顺序",
      expect.objectContaining({ id: "f1" }),
    );
  });
});
