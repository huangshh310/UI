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
    preview: "包含 7 种视觉变体与键盘焦点环。",
  },
  {
    id: "table",
    title: "DataTable 数据表格",
    description: "排序、搜索与分页表格",
    category: "数据",
    preview: "基于 TanStack Table v9 构建。",
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
});
