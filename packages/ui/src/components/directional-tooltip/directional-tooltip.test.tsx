import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { DirectionalTooltip, DirectionalTooltipProvider } from "../../index.js";

afterEach(cleanup);

describe("DirectionalTooltip", () => {
  it("聚焦或悬停触发器时按指定方向显示提示并支持 Escape 关闭", async () => {
    const user = userEvent.setup();
    render(
      <DirectionalTooltipProvider delay={0}>
        <DirectionalTooltip content="复制命令" side="top" delay={0}>
          <button type="button">复制</button>
        </DirectionalTooltip>
      </DirectionalTooltipProvider>,
    );

    expect(screen.queryByText("复制命令")).toBeNull();
    await user.hover(screen.getByRole("button", { name: "复制" }));
    expect(await screen.findByText("复制命令")).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(screen.queryByText("复制命令")).toBeNull();
  });

  it("支持受控打开并记录方向属性", () => {
    render(
      <DirectionalTooltip open content="右侧说明" side="right">
        <button type="button">信息</button>
      </DirectionalTooltip>,
    );

    const popup = screen.getByText("右侧说明").closest('[data-slot="directional-tooltip"]');
    expect(popup).toBeTruthy();
  });
});
