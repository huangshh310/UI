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

  it("支持 accent / solid / banner 外观形态并传入 onDismiss 自动启用关闭按钮", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn<() => void>();

    const { container } = render(
      <div>
        <Alert appearance="accent" variant="success" title="同步完成" />
        <Alert appearance="solid" variant="info" title="新版本已发布" />
        <Alert appearance="banner" variant="neutral" title="维护公告" onDismiss={onDismiss} />
      </div>,
    );

    const alerts = container.querySelectorAll('[data-slot="alert"]');
    expect(alerts[0]?.getAttribute("data-appearance")).toBe("accent");
    expect(alerts[1]?.getAttribute("data-appearance")).toBe("solid");
    expect(alerts[2]?.getAttribute("data-appearance")).toBe("banner");

    await user.click(screen.getByRole("button", { name: "关闭提示" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
