import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiAgentCockpitBlock } from "../../index.js";

afterEach(cleanup);

describe("AiAgentCockpitBlock", () => {
  it("支持切换智能体模式并触发快捷指令执行回调", async () => {
    const user = userEvent.setup();
    const onRunPrompt = vi.fn<(prompt: string, mode: string) => void>();

    render(<AiAgentCockpitBlock onRunPrompt={onRunPrompt} />);
    expect(screen.getByText("多模态智能体驾驶舱")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /实时语音/ }));
    expect(screen.getByText("正在聆听语音…")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "优化 C 端触感光影" }));
    expect(onRunPrompt).toHaveBeenCalledWith("优化 C 端触感光影", "voice");
  });
});
