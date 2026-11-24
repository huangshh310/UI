import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SpotlightSearch } from "../../index.js";

afterEach(cleanup);

const ITEMS = [
  {
    id: "btn",
    title: "Button 按钮",
    description: "核心触发动作与信号色强调",
    category: "基础",
    shortcut: "B",
    preview: "包含 7 种视觉变体与键盘焦点环。",
  },
  {
    id: "table",
    title: "DataTable 数据表格",
    description: "排序、搜索与分页表格",
    category: "数据",
    shortcut: "T",
    preview: "支持列排序、搜索过滤与分页。",
  },
];

describe("SpotlightSearch", () => {
  it("打开弹层后按分类胶囊与关键词过滤并执行选择", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(item: unknown) => void>();

    render(
      <SpotlightSearch
        triggerLabel="聚焦搜索"
        items={ITEMS}
        recentQueries={["Button"]}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("button", { name: /聚焦搜索/ }));
    expect(screen.getByRole("dialog", { name: "聚焦搜索" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "数据" }));
    expect(screen.queryByRole("button", { name: /Button 按钮/ })).toBeNull();
    const match = screen.getByRole("button", { name: /DataTable 数据表格/ });
    expect(match).toBeTruthy();

    await user.click(match);
    expect(onSelect).toHaveBeenCalledWith(ITEMS[1]);
  });

  it("支持输入框方向键切换高亮、回车选择与清空搜索按钮", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(item: unknown) => void>();

    render(<SpotlightSearch defaultOpen size="lg" items={ITEMS} onSelect={onSelect} />);

    const input = screen.getByLabelText("聚焦搜索输入框");
    await user.type(input, "Button");
    expect(screen.getByRole("button", { name: "清空搜索" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "清空搜索" }));

    input.focus();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith(ITEMS[1]);
  });
});
