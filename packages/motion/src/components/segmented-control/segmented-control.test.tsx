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

  it("支持 glass / signal 变体、三档尺寸并跳过禁用项", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(val: string) => void>();

    const { container } = render(
      <SegmentedControl
        variant="signal"
        size="lg"
        fullWidth
        defaultValue="day"
        onValueChange={onValueChange}
        items={[
          { value: "day", label: "按日" },
          { value: "week", label: "按周", disabled: true },
          { value: "month", label: "按月" },
        ]}
      />,
    );

    const root = container.querySelector('[data-slot="segmented-control"]');
    expect(root?.getAttribute("data-variant")).toBe("signal");
    expect(root?.getAttribute("data-size")).toBe("lg");

    screen.getByRole("button", { name: "按日" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith("month");
  });
});
