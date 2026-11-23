import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SettingsBlock } from "../../index.js";

afterEach(cleanup);

describe("SettingsBlock", () => {
  it("调整通知勾选与区域并点击保存触发回调", async () => {
    const user = userEvent.setup();
    const onSave =
      vi.fn<(state: { region: string; releaseAlert: boolean; auditAlert: boolean }) => void>();

    render(<SettingsBlock onSave={onSave} />);
    await user.click(screen.getByRole("checkbox", { name: /发布状态告警/ }));
    expect(screen.getByText("有未保存的更改")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "保存设置" }));

    expect(onSave).toHaveBeenCalledWith({
      region: "ap-northeast-1",
      releaseAlert: false,
      auditAlert: true,
    });
    expect(screen.getByText("设置已保存")).toBeTruthy();
  });

  it("支持 sectioned 变体与一键重置未保存更改", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn<() => void>();

    const { container } = render(
      <SettingsBlock
        variant="sectioned"
        title="生产环境设置"
        defaultRegion="ap-southeast-1"
        onReset={onReset}
      />,
    );

    expect(
      container.querySelector('[data-slot="settings-block"]')?.getAttribute("data-variant"),
    ).toBe("sectioned");
    expect(screen.getByText("生产环境设置")).toBeTruthy();

    const auditBox = screen.getByRole("checkbox", { name: /无障碍回归巡检/ });
    await user.click(auditBox);
    expect(screen.getByRole("button", { name: "重置" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "重置" }));
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("有未保存的更改")).toBeNull();
  });
});
