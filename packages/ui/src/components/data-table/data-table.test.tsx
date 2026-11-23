/**
 * DataTable 单元测试：验证排序 aria-sort、全局搜索过滤与清空、分页、行选择、行点击回调与空状态。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DataTable, type DataTableColumn } from "../../index.js";

afterEach(cleanup);

interface Member {
  id: string;
  name: string;
  score: number;
}

const ROWS: Member[] = [
  { id: "1", name: "Alice", score: 80 },
  { id: "2", name: "Bob", score: 95 },
  { id: "3", name: "Carol", score: 70 },
];

const COLUMNS: DataTableColumn<Member>[] = [
  { id: "name", header: "成员", accessor: (r) => r.name, sortable: true },
  { id: "score", header: "评分", accessor: (r) => r.score, sortable: true, align: "right" },
];

describe("DataTable", () => {
  it("支持点击表头排序（更新 aria-sort）与全局搜索过滤及清除", async () => {
    const user = userEvent.setup();
    render(<DataTable data={ROWS} columns={COLUMNS} getRowId={(r) => r.id} searchable />);

    const scoreBtn = screen.getByRole("button", { name: /评分/ });
    await user.click(scoreBtn);
    expect(scoreBtn.closest("th")?.getAttribute("aria-sort")).toBe("ascending");

    await user.type(screen.getByRole("searchbox", { name: "搜索表格" }), "bob");
    expect(screen.getByText("Bob")).toBeTruthy();
    expect(screen.queryByText("Alice")).toBeNull();

    await user.click(screen.getByRole("button", { name: "清除搜索" }));
    expect(screen.getByText("Alice")).toBeTruthy();
  });

  it("支持分页与行选择回调", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn<(rows: Member[]) => void>();
    render(
      <DataTable
        data={ROWS}
        columns={COLUMNS}
        getRowId={(r) => r.id}
        selectable
        pageSize={2}
        onSelectionChange={onSelectionChange}
      />,
    );

    expect(screen.queryByText("Carol")).toBeNull();
    await user.click(screen.getByRole("button", { name: "下一页" }));
    expect(screen.getByText("Carol")).toBeTruthy();

    await user.click(screen.getByRole("checkbox", { name: "选择当前页全部行" }));
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it("支持外观变体、行点击与工具栏扩展槽，数据为空时显示空状态文案", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn<(row: Member) => void>();
    const { rerender } = render(
      <DataTable
        data={ROWS}
        columns={COLUMNS}
        getRowId={(r) => r.id}
        variant="minimal"
        density="compact"
        striped
        onRowClick={onRowClick}
        toolbarActions={<button type="button">导出</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "导出" })).toBeTruthy();
    await user.click(screen.getByText("Alice"));
    expect(onRowClick).toHaveBeenCalledWith(ROWS[0]);

    rerender(<DataTable data={[]} columns={COLUMNS} emptyMessage="暂无成员记录" />);
    expect(screen.getByText("暂无成员记录")).toBeTruthy();

    rerender(<DataTable data={ROWS} columns={COLUMNS} loading />);
    expect(screen.getAllByText("加载中").length).toBeGreaterThan(0);
  });
});
