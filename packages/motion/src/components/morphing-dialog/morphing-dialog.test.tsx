import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MorphingDialog } from "../../index.js";

afterEach(cleanup);

describe("MorphingDialog", () => {
  it("点击触发卡片后平滑展开为具名对话框并支持 Escape 关闭", async () => {
    const user = userEvent.setup();
    render(
      <MorphingDialog
        title="边缘节点监控"
        subtitle="东京 · ap-northeast-1"
        tag="运行中"
        tagTone="success"
        meta="P95 14ms"
        size="lg"
        footer={<button type="button">关闭预览</button>}
      >
        <p>过去 24 小时平均延迟 14ms。</p>
      </MorphingDialog>,
    );

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("P95 14ms")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /边缘节点监控/ }));

    const dialog = screen.getByRole("dialog", { name: "边缘节点监控" });
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute("data-size")).toBe("lg");
    expect(screen.getByText("过去 24 小时平均延迟 14ms。")).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
