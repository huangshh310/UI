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

  it("支持 studio 变体、紧凑布局与自定义标题", () => {
    const { container } = render(
      <AiAgentCockpitBlock
        defaultMode="research"
        variant="studio"
        compact
        title="深度研究驾驶舱"
      />,
    );

    const root = container.querySelector('[data-slot="ai-agent-cockpit-block"]');
    expect(root?.getAttribute("data-variant")).toBe("studio");
    expect(screen.getByText("深度研究驾驶舱")).toBeTruthy();
    expect(screen.getByText("深度推理中")).toBeTruthy();
  });
});
