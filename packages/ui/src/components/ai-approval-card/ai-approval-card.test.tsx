import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiApprovalCard } from "../../index.js";

afterEach(cleanup);

describe("AiApprovalCard", () => {
  it("选择执行策略后点击批准执行触发 onApprove 并进入已审计状态", async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn<(optionId: string) => void>();

    render(<AiApprovalCard title="授权执行生产迁移脚本" onApprove={onApprove} />);
    await user.click(screen.getByRole("button", { name: /单次授权并记录审计日志/ }));
    await user.click(screen.getByRole("button", { name: "批准执行" }));

    expect(onApprove).toHaveBeenCalledWith("once");
    expect(screen.getByText(/已批准执行/)).toBeTruthy();
  });
});
