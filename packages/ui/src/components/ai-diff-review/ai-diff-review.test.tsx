import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiDiffReview } from "../../index.js";

afterEach(cleanup);

describe("AiDiffReview", () => {
  it("支持按行勾选/取消变更并点击应用变更触发回调", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn<(ids: string[]) => void>();

    render(<AiDiffReview fileName="packages/tokens/shadows.css" onApply={onApply} />);
    expect(screen.getByText("packages/tokens/shadows.css")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /应用 3 处变更/ }));
    expect(onApply).toHaveBeenCalledWith(["d2", "d3", "d4"]);
    expect(screen.getByText("已应用变更")).toBeTruthy();
  });

  it("支持变更摘要、语言角标、adaptive 主题与全部放弃回调", async () => {
    const user = userEvent.setup();
    const onRejectAll = vi.fn<() => void>();
    const { container } = render(
      <AiDiffReview
        fileName="registry.json"
        summary="同步新增 AI 组件条目计数"
        language="json"
        theme="adaptive"
        onRejectAll={onRejectAll}
      />,
    );

    expect(container.querySelector('[data-theme="adaptive"]')).toBeTruthy();
    expect(screen.getByText("同步新增 AI 组件条目计数")).toBeTruthy();
    expect(screen.getByText("json")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "放弃" }));
    expect(onRejectAll).toHaveBeenCalledTimes(1);
    expect(screen.getByText("已勾选 0 / 3 处变更")).toBeTruthy();
  });
});
