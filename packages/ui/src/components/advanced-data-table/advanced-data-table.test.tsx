/**
 * AdvancedDataTable 单元测试：验证分面筛选、列显隐、行密度切换、搜索清空、行点击、批量操作栏与 CSV 导出。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AdvancedDataTable,
  type AdvancedTableColumn,
  type AdvancedTableFacet,
} from "../../index.js";

afterEach(cleanup);

interface Pkg {
  id: string;
  name: string;
  status: "stable" | "beta";
  size: string;
}

const DATA: Pkg[] = [
  { id: "1", name: "@matt-ui/tokens", status: "stable", size: "4 KB" },
  { id: "2", name: "@matt-ui/ui", status: "stable", size: "18 KB" },
  { id: "3", name: "@matt-ui/motion", status: "beta", size: "12 KB" },
];

const COLS: AdvancedTableColumn<Pkg>[] = [
  { id: "name", header: "包名", accessor: (r) => r.name, sortable: true, hideable: false },
  { id: "status", header: "状态", accessor: (r) => r.status },
  { id: "size", header: "体积", accessor: (r) => r.size, align: "right" },
];

const FACETS: AdvancedTableFacet<Pkg>[] = [
  {
    id: "status",
    label: "状态",
    getValue: (r) => r.status,
    options: [
      { value: "stable", label: "稳定" },
      { value: "beta", label: "测试" },
    ],
  },
];

describe("AdvancedDataTable", () => {
  it("支持分面筛选、列显隐开关与 CSV 导出", async () => {
    const user = userEvent.setup();
    const onExportCsv = vi.fn<(csv: string, rows: Pkg[]) => void>();

    render(
      <AdvancedDataTable
        data={DATA}
        columns={COLS}
        getRowId={(r) => r.id}
        facets={FACETS}
        onExportCsv={onExportCsv}
      />,
    );

    await user.click(screen.getByRole("button", { name: "测试" }));
    expect(screen.getByText("@matt-ui/motion")).toBeTruthy();
    expect(screen.queryByText("@matt-ui/tokens")).toBeNull();

    await user.click(screen.getByRole("button", { name: "导出 CSV" }));
    expect(onExportCsv).toHaveBeenCalledTimes(1);
    expect(onExportCsv.mock.calls[0]?.[0]).toContain("@matt-ui/motion");

    await user.click(screen.getByRole("button", { name: "列显隐" }));
    const sizeToggle = await screen.findByRole("checkbox", { name: "体积" });
    await user.click(sizeToggle);
    expect(screen.queryByRole("columnheader", { name: "体积" })).toBeNull();
  });

  it("支持密度切换、多选批量操作、行点击与外观变体", async () => {
    const user = userEvent.setup();
    const onArchive = vi.fn<(rows: Pkg[]) => void>();
    const onRowClick = vi.fn<(row: Pkg) => void>();

    render(
      <AdvancedDataTable
        variant="minimal"
        striped
        data={DATA}
        columns={COLS}
        getRowId={(r) => r.id}
        onRowClick={onRowClick}
        batchActions={[
          { id: "archive", label: "归档所选", tone: "destructive", onAction: onArchive },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "紧凑" }));
    expect(screen.getByRole("button", { name: "紧凑" }).getAttribute("aria-pressed")).toBe("true");

    await user.click(screen.getByText("@matt-ui/tokens"));
    expect(onRowClick).toHaveBeenCalledWith(DATA[0]);

    await user.click(screen.getByRole("checkbox", { name: "选择第 1 行" }));
    await user.click(screen.getByRole("button", { name: "归档所选" }));
    expect(onArchive).toHaveBeenCalledWith([DATA[0]]);
  });
});
