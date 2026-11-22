import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OriginDropdown } from "../../index.js";

afterEach(cleanup);

describe("OriginDropdown", () => {
  it("展开菜单、触发动作项回调并切换复选项", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn<() => void>();
    const onToggleGrid = vi.fn<(checked: boolean) => void>();

    render(
      <OriginDropdown
        label="更多操作"
        items={[
          {
            kind: "group",
            label: "工作区",
            items: [
              {
                kind: "action",
                id: "rename",
                label: "重命名",
                description: "修改项目标识",
                shortcut: "⌘R",
                onSelect: onRename,
              },
              {
                kind: "checkbox",
                id: "grid",
                label: "显示对齐网格",
                checked: false,
                onCheckedChange: onToggleGrid,
              },
            ],
          },
          { kind: "separator" },
          { kind: "action", id: "delete", label: "删除项目", tone: "destructive" },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", { name: "更多操作" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeTruthy();

    await user.click(screen.getByRole("menuitem", { name: /重命名/ }));
    expect(onRename).toHaveBeenCalledTimes(1);

    trigger.focus();
    await user.keyboard("{Enter}");
    await user.click(await screen.findByRole("menuitemcheckbox", { name: /显示对齐网格/ }));
    expect(onToggleGrid).toHaveBeenCalledWith(true);
  });
});
