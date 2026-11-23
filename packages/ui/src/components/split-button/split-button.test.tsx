/**
 * SplitButton 的行为规约。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SplitButton } from "../../index.js";

afterEach(cleanup);

describe("SplitButton", () => {
  it("点击主按钮直接执行 onClick 且不打开下拉菜单", async () => {
    const onPrimary = vi.fn<() => void>();
    const onDraft = vi.fn<() => void>();
    render(
      <SplitButton
        onClick={onPrimary}
        actions={[{ id: "draft", label: "保存为草稿", onSelect: onDraft }]}
      >
        保存
      </SplitButton>,
    );

    await userEvent.click(screen.getByRole("button", { name: "保存" }));

    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(onDraft).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("点击箭头按钮打开菜单并执行选中的相关操作", async () => {
    const onPublish = vi.fn<() => void>();
    render(
      <SplitButton
        variant="signal"
        size="sm"
        radius="default"
        menuLabel="更多发布方式"
        actions={[
          {
            id: "publish",
            label: "保存并发布",
            description: "立即同步至线上节点",
            shortcut: "⌘⇧P",
            onSelect: onPublish,
          },
        ]}
      >
        保存
      </SplitButton>,
    );

    const root = screen.getByRole("button", { name: "保存" }).closest('[data-slot="split-button"]');
    expect(root?.getAttribute("data-variant")).toBe("signal");
    expect(root?.getAttribute("data-size")).toBe("sm");
    expect(root?.getAttribute("data-radius")).toBe("default");

    await userEvent.click(screen.getByRole("button", { name: "更多发布方式" }));
    const item = await screen.findByRole("menuitem", { name: /保存并发布/ });
    await userEvent.click(item);

    expect(onPublish).toHaveBeenCalledTimes(1);
  });

  it("loading 为真时拦截主操作点击并禁用菜单触发器", async () => {
    const onPrimary = vi.fn<() => void>();
    render(
      <SplitButton
        loading
        onClick={onPrimary}
        actions={[{ id: "draft", label: "保存为草稿", onSelect: vi.fn<() => void>() }]}
      >
        保存中
      </SplitButton>,
    );

    const primary = screen.getByRole("button", { name: "保存中" });
    const trigger = screen.getByRole("button", { name: "More actions" });

    expect(primary.getAttribute("aria-busy")).toBe("true");
    expect(primary.getAttribute("aria-disabled")).toBe("true");
    expect(trigger.hasAttribute("disabled")).toBe(true);

    await userEvent.click(primary);
    expect(onPrimary).not.toHaveBeenCalled();
  });
});
