import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiPromptGallery } from "../../index.js";

afterEach(cleanup);

describe("AiPromptGallery", () => {
  it("支持按分类筛选提示词卡片并在点击时触发 onSelect 回调", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(template: { id: string }) => void>();

    render(<AiPromptGallery onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "编程" }));
    expect(screen.queryByText("重构 C 端高光层次")).toBeNull();
    expect(screen.getByText("生成无障碍组件测试")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /生成无障碍组件测试/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
