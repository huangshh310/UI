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
  });
});
