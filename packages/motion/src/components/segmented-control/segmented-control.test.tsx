import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "../../index.js";

afterEach(cleanup);

describe("SegmentedControl", () => {
  it("支持点击与键盘左右方向键切换分段选项", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(val: string) => void>();

    render(
      <SegmentedControl
        items={[
          { value: "chat", label: "智能对话" },
          { value: "voice", label: "实时语音" },
          { value: "deep", label: "深度研究" },
        ]}
        defaultValue="chat"
        onValueChange={onValueChange}
      />,
    );

    const voiceBtn = screen.getByRole("button", { name: "实时语音" });
    await user.click(voiceBtn);
    expect(onValueChange).toHaveBeenCalledWith("voice");

    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith("deep");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "深度研究" }));

    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenCalledWith("chat");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "智能对话" }));

    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenCalledWith("deep");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "深度研究" }));
  });
});
