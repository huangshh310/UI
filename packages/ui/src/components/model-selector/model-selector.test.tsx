/**
 * ModelSelector 行为规约：验证紧凑胶囊打开 Popover、按厂商分组、搜索过滤模型、切换思考强度与联网开关。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ModelSelector, type ModelSelectorValue } from "../../index.js";

afterEach(cleanup);

describe("ModelSelector", () => {
  it("点击紧凑触发器展开浮层，支持关键词筛选模型、选择新模型并切换思考强度", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(next: ModelSelectorValue) => void>();

    render(<ModelSelector onValueChange={onValueChange} />);

    const trigger = screen.getByRole("button", { name: /选择模型/ });
    await user.click(trigger);

    const search = screen.getByRole("searchbox", { name: "搜索模型" });
    await user.type(search, "Flash");

    const flashOption = screen.getByRole("button", { name: /Flash/ });
    await user.click(flashOption);

    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ modelId: "flash", effort: "balanced" }),
    );

    await user.click(screen.getByRole("button", { name: /选择模型/ }));
    await user.click(screen.getByRole("button", { name: "深度" }));
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ modelId: "flash", effort: "deep" }),
    );
  });

  it("支持按 provider 分组展示、ghost 触发器变体与联网开关切换", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(next: ModelSelectorValue) => void>();

    render(
      <ModelSelector variant="ghost" size="sm" groupByProvider onValueChange={onValueChange} />,
    );

    const trigger = screen.getByRole("button", { name: /选择模型/ });
    expect(trigger.getAttribute("data-variant")).toBe("ghost");
    await user.click(trigger);

    expect(screen.getByText("旗舰系列")).toBeTruthy();
    expect(screen.getByText("高速系列")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "联网" }));
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ modelId: "pro", webSearch: true }),
    );
  });
});
