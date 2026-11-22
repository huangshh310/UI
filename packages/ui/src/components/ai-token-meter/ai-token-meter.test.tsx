import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiTokenMeter } from "../../index.js";

afterEach(cleanup);

describe("AiTokenMeter", () => {
  it("展示上下文窗口分段占用，点击压缩上下文后释放历史 Token 并触发回调", async () => {
    const user = userEvent.setup();
    const onCompact = vi.fn<(saved: number) => void>();

    render(<AiTokenMeter onCompact={onCompact} />);
    expect(screen.getByText(/148\.0K \/ 200\.0K/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /压缩上下文/ }));
    expect(onCompact).toHaveBeenCalledWith(52_800);
    expect(screen.getByText(/已压缩 -36%/)).toBeTruthy();
  });

  it("自定义分段与容量时精确计算释放 Token 数与动态压缩百分比", async () => {
    const user = userEvent.setup();
    const onCompact = vi.fn<(saved: number) => void>();

    render(
      <AiTokenMeter
        maxTokens={100_000}
        segments={[
          { id: "system", label: "系统提示", tokens: 10_000, tone: "primary" },
          { id: "history", label: "历史对话", tokens: 50_000, tone: "signal" },
        ]}
        onCompact={onCompact}
      />,
    );

    await user.click(screen.getByRole("button", { name: /压缩上下文/ }));
    expect(onCompact).toHaveBeenCalledWith(30_000);
    expect(screen.getByText(/已压缩 -50%/)).toBeTruthy();
  });
});
