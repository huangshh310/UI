/**
 * Context 行为规约：验证紧凑环形胶囊触发浮层明细、分段高亮、只读模式与一键压缩上下文。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Context } from "../../index.js";

afterEach(cleanup);

describe("Context", () => {
  it("pill 形态渲染紧凑上下文占用百分比，点击展开浮层后可执行压缩上下文", async () => {
    const user = userEvent.setup();
    const onCompact = vi.fn<(saved: number) => void>();

    render(
      <Context
        maxTokens={100000}
        modelName="claude-3.7-sonnet"
        segments={[
          { id: "system", label: "系统提示", tokens: 10000, tone: "primary" },
          { id: "history", label: "历史消息", tokens: 50000, tone: "signal" },
        ]}
        onCompact={onCompact}
      />,
    );

    const trigger = screen.getByRole("button", { name: /上下文窗口占用 60%/ });
    await user.click(trigger);

    expect(screen.getByText("历史消息")).toBeTruthy();
    expect(screen.getByText(/claude-3\.7-sonnet/)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "压缩上下文" }));
    expect(onCompact).toHaveBeenCalledWith(30000);
    expect(screen.getByText(/已释放 30\.0K/)).toBeTruthy();
  });

  it("variant=inline 直接平铺分段进度并支持分段聚焦切换与只读隐藏压缩按钮", async () => {
    const user = userEvent.setup();
    render(<Context variant="inline" compactable={false} surface="glass" />);

    const historyBtn = screen.getByRole("button", { name: /历史对话/ });
    await user.click(historyBtn);
    expect(historyBtn.getAttribute("aria-pressed")).toBe("true");
    expect(screen.queryByRole("button", { name: "压缩上下文" })).toBeNull();
  });
});
