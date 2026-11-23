import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiVoiceStage } from "../../index.js";

afterEach(cleanup);

describe("AiVoiceStage", () => {
  it("支持静音切换、字幕显隐与结束语音会话后重新连线", async () => {
    const user = userEvent.setup();
    const onEndSession = vi.fn<() => void>();

    render(<AiVoiceStage onEndSession={onEndSession} />);
    expect(screen.getByText("正在聆听你的声音…")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "静音麦克风" }));
    expect(screen.getByText("语音通话已暂停")).toBeTruthy();
    expect(screen.getByText("PAUSED")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "结束语音会话" }));
    expect(onEndSession).toHaveBeenCalledTimes(1);
    expect(screen.getByText("语音会话已结束")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "重新连线" }));
    expect(screen.getByText("正在聆听你的声音…")).toBeTruthy();
  });

  it("支持 obsidian 舞台风格、模型标签、时长读数与用户字幕标识", () => {
    const { container } = render(
      <AiVoiceStage
        variant="obsidian"
        defaultState="speaking"
        modelLabel="Voice · Realtime"
        durationLabel="01:24"
        speaker="user"
        caption="帮我规划周五的发布检查单"
      />,
    );
    const root = container.querySelector('[data-slot="ai-voice-stage"]');
    expect(root?.getAttribute("data-variant")).toBe("obsidian");
    expect(screen.getByText("Voice · Realtime")).toBeTruthy();
    expect(screen.getByText("01:24")).toBeTruthy();
    expect(screen.getByText("你")).toBeTruthy();
  });
});
