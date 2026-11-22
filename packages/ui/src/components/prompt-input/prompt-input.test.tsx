/**
 * PromptInput 单元测试：验证 Enter 提交、Shift+Enter 换行、IME 组合态防误触、停止状态与附件/建议交互。
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PromptInput } from "../../index.js";

afterEach(cleanup);

describe("PromptInput", () => {
  it("Enter 提交非空内容，Shift+Enter 换行不提交", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(value: string) => void>();

    render(<PromptInput onSubmit={onSubmit} placeholder="输入问题…" />);
    const input = screen.getByPlaceholderText("输入问题…");

    await user.type(input, "第一行{Shift>}{Enter}{/Shift}第二行");
    expect(onSubmit).not.toHaveBeenCalled();

    await user.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("第一行\n第二行");
  });

  it("中文输入法组合态下按 Enter 不会误触提交", () => {
    const onSubmit = vi.fn<(value: string) => void>();
    render(<PromptInput defaultValue="你好" onSubmit={onSubmit} />);
    const input = screen.getByRole("textbox");

    fireEvent.keyDown(input, { key: "Enter", isComposing: true });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("streaming 状态切换为停止按钮并触发 onStop", async () => {
    const user = userEvent.setup();
    const onStop = vi.fn<() => void>();

    render(<PromptInput status="streaming" onStop={onStop} />);
    await user.click(screen.getByRole("button", { name: "停止生成" }));
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it("支持附件移除、模型切换与快捷建议点击", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn<(id: string) => void>();
    const onModelChange = vi.fn<(id: string) => void>();
    const onSelectSuggestion = vi.fn<(text: string) => void>();

    render(
      <PromptInput
        attachments={[{ id: "a1", name: "design-tokens.css", size: "12 KB" }]}
        onRemoveAttachment={onRemove}
        models={[
          { id: "fast", label: "快速" },
          { id: "pro", label: "深度思考" },
        ]}
        selectedModel="fast"
        onModelChange={onModelChange}
        suggestions={["生成一套配色方案"]}
        onSelectSuggestion={onSelectSuggestion}
      />,
    );

    await user.click(screen.getByRole("button", { name: "移除附件 design-tokens.css" }));
    expect(onRemove).toHaveBeenCalledWith("a1");

    await user.click(screen.getByRole("button", { name: "深度思考" }));
    expect(onModelChange).toHaveBeenCalledWith("pro");

    await user.click(screen.getByRole("button", { name: "生成一套配色方案" }));
    expect(onSelectSuggestion).toHaveBeenCalledWith("生成一套配色方案");
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("生成一套配色方案");
  });
});
