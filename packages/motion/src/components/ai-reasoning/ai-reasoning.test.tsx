import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiReasoning } from "../../index.js";

afterEach(cleanup);

describe("AiReasoning", () => {
  it("默认展示推理状态摘要，点击可折叠或展开思维链步骤明细", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn<(expanded: boolean) => void>();
    render(<AiReasoning defaultExpanded onExpandedChange={onExpandedChange} />);

    expect(screen.getByText(/查询京都本周末天气与日落时间/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /已完成深度推理/ }));
    expect(onExpandedChange).toHaveBeenCalledWith(false);
    await waitFor(() => {
      expect(screen.queryByText(/查询京都本周末天气与日落时间/)).toBeNull();
    });
  });

  it("支持 ghost 变体、自定义标题与思考 Token 计数展示", () => {
    const { container } = render(
      <AiReasoning
        status="thinking"
        variant="ghost"
        title="Claude 深度分析中…"
        tokensLabel="486 tok"
      />,
    );
    const root = container.querySelector('[data-slot="ai-reasoning"]');
    expect(root?.getAttribute("data-variant")).toBe("ghost");
    expect(screen.getByText("Claude 深度分析中…")).toBeTruthy();
    expect(screen.getByText("486 tok")).toBeTruthy();
  });
});
