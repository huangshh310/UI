import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiWorkspaceBlock } from "../../index.js";

afterEach(cleanup);

describe("AiWorkspaceBlock", () => {
  it("支持切换会话线程并通过 PromptInput 发送消息", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn<(text: string, model: string) => void>();

    render(<AiWorkspaceBlock onSend={onSend} />);
    expect(screen.getByText(/帮我核对新组件/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /Registry 分发检查/ }));
    expect(screen.getByText(/全部 71 个 Registry 条目/)).toBeTruthy();

    const textbox = screen.getByRole("textbox");
    await user.type(textbox, "生成 Sheet 悬浮样式代码");
    await user.keyboard("{Enter}");

    expect(onSend).toHaveBeenCalledWith("生成 Sheet 悬浮样式代码", "claude-sonnet");
    expect(screen.getByText("生成 Sheet 悬浮样式代码")).toBeTruthy();
  });
});
