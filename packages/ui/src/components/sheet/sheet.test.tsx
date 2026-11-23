import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Sheet } from "../../index.js";

afterEach(cleanup);

describe("Sheet", () => {
  it("从指定方向打开抽屉并可通过关闭按钮或 Escape 关闭", async () => {
    const user = userEvent.setup();
    render(
      <Sheet
        side="right"
        size="md"
        trigger={<button type="button">打开详情</button>}
        title="部署配置"
        description="调整节点与环境变量"
        footer={<button type="button">保存</button>}
      >
        <p>抽屉主体内容</p>
      </Sheet>,
    );

    await user.click(screen.getByRole("button", { name: "打开详情" }));
    const dialog = screen.getByRole("dialog", { name: "部署配置" });
    expect(dialog.getAttribute("data-side")).toBe("right");
    expect(dialog.getAttribute("data-inset")).toBe("true");
    expect(screen.getByText("抽屉主体内容")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "关闭抽屉" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("支持 left / top / bottom 方向属性标记以及 inset={false} 贴边模式", async () => {
    render(
      <Sheet open side="bottom" inset={false} title="快捷操作">
        <p>底部面板</p>
      </Sheet>,
    );

    const dialog = screen.getByRole("dialog", { name: "快捷操作" });
    expect(dialog.getAttribute("data-side")).toBe("bottom");
    expect(dialog.getAttribute("data-inset")).toBe("false");
  });

  it("支持 icon、badge 与 xl 尺寸预设", () => {
    render(
      <Sheet
        open
        size="xl"
        badge="LIVE"
        icon={<span data-testid="sheet-icon">#</span>}
        title="实时巡检面板"
      >
        <p>节点状态正常</p>
      </Sheet>,
    );

    expect(screen.getByText("LIVE")).toBeTruthy();
    expect(screen.getByTestId("sheet-icon")).toBeTruthy();
  });
});
