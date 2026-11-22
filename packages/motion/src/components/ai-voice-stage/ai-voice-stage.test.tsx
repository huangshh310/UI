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

    await user.click(screen.getByRole("button", { name: "结束语音会话" }));
    expect(onEndSession).toHaveBeenCalledTimes(1);
    expect(screen.getByText("语音会话已结束")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "重新连线" }));
    expect(screen.getByText("正在聆听你的声音…")).toBeTruthy();
  });
});
