import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiAgentPlan } from "../../index.js";

afterEach(cleanup);

describe("AiAgentPlan", () => {
  it("支持点击推进下一步更新任务进度并在全部完成后展示重置按钮", async () => {
    const user = userEvent.setup();
    const onStepAdvance = vi.fn<(done: number, total: number) => void>();

    render(<AiAgentPlan onStepAdvance={onStepAdvance} />);
    expect(screen.getByText(/1 \/ 4 步/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "推进下一步" }));
    expect(onStepAdvance).toHaveBeenCalledWith(2, 4);
    expect(screen.getByText(/2 \/ 4 步/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "推进下一步" }));
    await user.click(screen.getByRole("button", { name: "推进下一步" }));
    expect(screen.getByRole("button", { name: "重置计划" })).toBeTruthy();
  });

  it("支持 timeline 变体、subtitle 副标题、failed/skipped 状态以及隐藏底部控制栏", () => {
    const { container } = render(
      <AiAgentPlan
        variant="timeline"
        subtitle="Agent · Autonomous"
        showControls={false}
        initialSteps={[
          { id: "1", title: "拉取依赖图", status: "completed", duration: "0.3s" },
          { id: "2", title: "执行回归测试", status: "failed", tool: "vitest" },
          { id: "3", title: "跳过缓存预热", status: "skipped" },
        ]}
      />,
    );
    expect(container.querySelector('[data-variant="timeline"]')).toBeTruthy();
    expect(screen.getByText("Agent · Autonomous")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "推进下一步" })).toBeNull();
  });
});
