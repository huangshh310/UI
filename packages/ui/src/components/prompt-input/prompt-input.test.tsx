/**
 * PromptInput 行为规约：验证 Enter 提交、IME 组合防误触、斜杠命令面板、流式入队与复合子部件编排。
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "../../index.js";

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

  it("streaming 状态无草稿时显示停止按钮，传入 onQueue 且输入草稿后可加入待发队列", async () => {
    const user = userEvent.setup();
    const onStop = vi.fn<() => void>();
    const onQueue = vi.fn<(value: string) => void>();

    render(<PromptInput status="streaming" onStop={onStop} onQueue={onQueue} />);
    await user.click(screen.getByRole("button", { name: "停止生成" }));
    expect(onStop).toHaveBeenCalledTimes(1);

    await user.type(screen.getByRole("textbox"), "追问一句边界条件");
    await user.click(screen.getByRole("button", { name: "加入待发队列" }));
    expect(onQueue).toHaveBeenCalledWith("追问一句边界条件");
  });

  it("输入斜杠前缀呼出指令菜单并支持键盘/点击回填，同时兼容附件、模型与复合子部件", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn<(id: string) => void>();
    const onModelChange = vi.fn<(id: string) => void>();
    const onSelectSuggestion = vi.fn<(text: string) => void>();
    const onSubmitCompound = vi.fn<(v: string) => void>();

    render(
      <div>
        <PromptInput
          attachments={[{ id: "a1", name: "design-tokens.css", size: "12 KB" }]}
          onRemoveAttachment={onRemove}
          slashCommands={[
            {
              id: "c1",
              command: "review",
              description: "深度代码审阅",
              template: "/review 请审查无障碍焦点环：",
            },
          ]}
          models={[
            { id: "fast", label: "快速" },
            { id: "pro", label: "深度思考" },
          ]}
          selectedModel="fast"
          onModelChange={onModelChange}
          suggestions={["生成一套配色方案"]}
          onSelectSuggestion={onSelectSuggestion}
        />
        <PromptInput onSubmit={onSubmitCompound}>
          <PromptInputTextarea placeholder="复合模式输入…" />
          <PromptInputFooter>
            <PromptInputTools>
              <span>工具槽</span>
            </PromptInputTools>
            <PromptInputSubmit />
          </PromptInputFooter>
        </PromptInput>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "移除附件 design-tokens.css" }));
    expect(onRemove).toHaveBeenCalledWith("a1");

    await user.click(screen.getByRole("button", { name: "深度思考" }));
    expect(onModelChange).toHaveBeenCalledWith("pro");

    const firstInput = screen.getAllByRole("textbox")[0]!;
    await user.type(firstInput, "/rev");
    await user.click(screen.getByRole("button", { name: /\/review/ }));
    expect((firstInput as HTMLTextAreaElement).value).toBe("/review 请审查无障碍焦点环：");

    await user.click(screen.getByRole("button", { name: "生成一套配色方案" }));
    expect(onSelectSuggestion).toHaveBeenCalledWith("生成一套配色方案");

    const compoundInput = screen.getByPlaceholderText("复合模式输入…");
    await user.type(compoundInput, "复合发送{Enter}");
    expect(onSubmitCompound).toHaveBeenCalledWith("复合发送");
  });

  it("支持变体、顶部建议条与 error 告警提示", async () => {
    const user = userEvent.setup();
    render(
      <PromptInput
        variant="elevated"
        size="sm"
        radius="lg"
        suggestionsPosition="top"
        suggestions={["生成发布说明"]}
        error="超出上下文上限"
      />,
    );

    expect(screen.getByRole("alert").textContent).toBe("超出上下文上限");
    await user.click(screen.getByRole("button", { name: "生成发布说明" }));
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("生成发布说明");
  });
});
