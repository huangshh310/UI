import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { CommandMenu } from "../../index.js";

beforeAll(() => {
  if (typeof Element !== "undefined" && !Element.prototype.getAnimations) {
    Element.prototype.getAnimations = () => [];
  }
});

afterEach(cleanup);

const GROUPS = [
  {
    heading: "导航",
    items: [
      { id: "docs", label: "查看文档", keywords: ["docs", "guide"], shortcut: "G D" },
      { id: "tokens", label: "设计 Token", keywords: ["color", "theme"] },
    ],
  },
  {
    heading: "操作",
    items: [
      {
        id: "theme",
        label: "切换主题",
        subPage: {
          heading: "选择主题",
          items: [
            { id: "theme-light", label: "浅色模式" },
            { id: "theme-dark", label: "深色模式" },
          ],
        },
      },
    ],
  },
];

describe("CommandMenu", () => {
  it("打开命令面板后可过滤命令、执行选择并支持全局快捷键", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(id: string) => void>();

    render(<CommandMenu triggerLabel="命令面板" groups={GROUPS} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: /命令面板/ }));
    const input = await screen.findByPlaceholderText("输入命令或关键词…");
    await user.type(input, "Token");

    const item = await screen.findByRole("option", { name: /设计 Token/, hidden: true });
    await user.click(item);
    expect(onSelect).toHaveBeenCalledWith("tokens");
  });

  it("支持进入子页面栈并返回上一级", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(id: string) => void>();

    render(<CommandMenu defaultOpen groups={GROUPS} onSelect={onSelect} />);
    await user.click(await screen.findByRole("option", { name: /切换主题/, hidden: true }));

    expect(await screen.findByText("选择主题")).toBeTruthy();
    await user.click(screen.getByRole("option", { name: /深色模式/, hidden: true }));
    expect(onSelect).toHaveBeenCalledWith("theme-dark");
  });
});
