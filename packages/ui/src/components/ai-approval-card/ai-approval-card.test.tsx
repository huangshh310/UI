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

  it("支持拒绝操作、工作目录与来源标注以及点击重审恢复待审批态", async () => {
    const user = userEvent.setup();
    const onReject = vi.fn<() => void>();

    render(
      <AiApprovalCard
        title="写入边缘配置"
        riskLevel="high"
        agentName="Core Agent · Bash"
        workingDir="~/work/UI"
        impact="影响 2 个节点 · 自动快照"
        onReject={onReject}
      />,
    );

    expect(screen.getByText(/Core Agent · Bash/)).toBeTruthy();
    expect(screen.getByText("~/work/UI")).toBeTruthy();
    expect(screen.getByText("影响 2 个节点 · 自动快照")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "拒绝" }));
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(screen.getByText("已拒绝执行")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "重审" }));
    expect(screen.getByRole("button", { name: "批准执行" })).toBeTruthy();
  });
});
