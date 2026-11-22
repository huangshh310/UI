import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Alert } from "../../index.js";

afterEach(cleanup);

describe("Alert", () => {
  it("渲染警告标题与正文并支持可关闭按钮回调", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn<() => void>();

    render(
      <Alert
        variant="destructive"
        title="构建校验失败"
        description="检测到未声明的外部依赖版本。"
        dismissible
        onDismiss={onDismiss}
      />,
    );

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("构建校验失败")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "关闭提示" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
