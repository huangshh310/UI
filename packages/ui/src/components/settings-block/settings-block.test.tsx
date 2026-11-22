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
    await user.click(screen.getByRole("button", { name: "保存设置" }));

    expect(onSave).toHaveBeenCalledWith({
      region: "ap-northeast-1",
      releaseAlert: false,
      auditAlert: true,
    });
  });
});
