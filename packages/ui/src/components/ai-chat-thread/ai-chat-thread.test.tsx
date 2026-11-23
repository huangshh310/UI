import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiChatThread } from "../../index.js";

afterEach(cleanup);

describe("AiChatThread", () => {
  it("支持切换助手多版本回复分支、点赞反馈与点击快捷追问追加对话", async () => {
    const user = userEvent.setup();
    const onFeedback = vi.fn<(id: string, vote: "up" | "down") => void>();
    const onFollowUp = vi.fn<(prompt: string) => void>();

    render(<AiChatThread onFeedback={onFeedback} onFollowUp={onFollowUp} />);
    expect(screen.getByText("1 / 2")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "下一版本回复" }));
    expect(screen.getByText("2 / 2")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "赞同回复" }));
    expect(onFeedback).toHaveBeenCalledWith("m2", "up");

    await user.click(screen.getByRole("button", { name: "加上第二天行程" }));
    expect(onFollowUp).toHaveBeenCalledWith("加上第二天行程");
    expect(screen.getByText(/已按「加上第二天行程」/)).toBeTruthy();
  });

  it("连续快速点击多次追问时生成唯一消息键且无控制台告警", async () => {
    const user = userEvent.setup();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<AiChatThread followUps={["追问一", "追问二"]} />);
    await user.click(screen.getByRole("button", { name: "追问一" }));
    await user.click(screen.getByRole("button", { name: "追问二" }));

    expect(screen.getByText(/已按「追问一」/)).toBeTruthy();
    expect(screen.getByText(/已按「追问二」/)).toBeTruthy();
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
