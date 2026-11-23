import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { AiReasoning } from "../../index.js";

afterEach(cleanup);

describe("AiReasoning", () => {
  it("默认展示推理状态摘要，点击可折叠或展开思维链步骤明细", async () => {
    const user = userEvent.setup();
    render(<AiReasoning defaultExpanded />);

    expect(screen.getByText(/查询京都本周末天气与日落时间/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /已完成深度推理/ }));
    expect(screen.queryByText(/查询京都本周末天气与日落时间/)).toBeNull();
  });
});
