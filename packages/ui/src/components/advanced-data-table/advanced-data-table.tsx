"use client";

/**
 * AdvancedDataTable：在 TanStack Table v9 之上扩展分面筛选、列显隐（Base UI Popover）、
 * 行密度切换、批量操作栏与 CSV 导出钩子的高级数据表格。
 */
import { cn } from "@matt-ui/utils";
import {
  useTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  ADV_TABLE_FEATURES,
  AdvFooter,
  AdvHead,
  AdvRows,
  type AdvTableFeatures,
} from "./advanced-table-body.js";
import {
  AdvancedTopToolbar,
  BatchActionBar,
  buildCsv,
  DENSITY_CELL_PADDING,
  FacetFilterBar,
} from "./advanced-table-controls.js";
import type {
  AdvancedDataTableProps,
  AdvancedTableColumn,
  AdvancedTableFacet,
  TableDensity,
} from "./advanced-data-table.types.js";

const applyFacets = <TData,>(
  data: TData[],
  facets: AdvancedTableFacet<TData>[] | undefined,
  active: Record<string, string | null>,
) =>
  facets?.length
    ? data.filter((row) =>
        facets.every((facet) => !active[facet.id] || facet.getValue(row) === active[facet.id]),
      )
    : data;

const buildDefs = <TData extends object>(
  columns: AdvancedTableColumn<TData>[],
): ColumnDef<AdvTableFeatures, TData, unknown>[] =>
  columns.map((col) => ({
    id: col.id,
    accessorFn: (row) => col.accessor?.(row) ?? "",
    enableSorting: Boolean(col.sortable),
    cell: ({ row }) =>
      col.cell ? col.cell(row.original) : String(col.accessor?.(row.original) ?? ""),
  }));

const initHidden = <TData,>(columns: AdvancedTableColumn<TData>[]) =>
  Object.fromEntries(columns.filter((c) => c.defaultHidden).map((c) => [c.id, true]));

const useAdvancedTable = <TData extends object>(props: AdvancedDataTableProps<TData>) => {
  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [density, setDensity] = useState<TableDensity>(props.defaultDensity ?? "normal");
  const [activeFacets, setActiveFacets] = useState<Record<string, string | null>>({});
  const [hiddenIds, setHiddenIds] = useState<Record<string, boolean>>(() =>
    initHidden(props.columns),
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const visibleCols = useMemo(
    () => props.columns.filter((c) => !hiddenIds[c.id]),
    [props.columns, hiddenIds],
  );
  const filteredData = useMemo(
    () => applyFacets(props.data, props.facets, activeFacets),
    [props.data, props.facets, activeFacets],
  );
  const defs = useMemo(() => buildDefs(visibleCols), [visibleCols]);

  const table = useTable<AdvTableFeatures, TData>({
    features: ADV_TABLE_FEATURES,
    data: filteredData,
    columns: defs,
    getRowId: props.getRowId ? (row, idx) => props.getRowId!(row, idx) : undefined,
    state: { sorting, globalFilter: query, rowSelection },
    initialState: { pagination: { pageIndex: 0, pageSize: props.pageSize ?? 5 } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setQuery,
    onRowSelectionChange: setRowSelection,
  });

  return {
    table,
    query,
    setQuery,
    density,
    setDensity,
    activeFacets,
    setActiveFacets,
    hiddenIds,
    setHiddenIds,
    setRowSelection,
    visibleCols,
  };
};

const AdvTableGrid = <TData extends object>({
  props,
  state,
  selectable,
}: {
  props: AdvancedDataTableProps<TData>;
  state: ReturnType<typeof useAdvancedTable<TData>>;
  selectable: boolean;
}) => (
  <div
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    tabIndex={0}
    aria-label={props.title ?? "高级数据表格"}
    className="w-full overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
  >
    <table className="w-full border-collapse">
      <AdvHead
        headers={state.table.getFlatHeaders()}
        visibleCols={state.visibleCols}
        selectable={selectable}
        allSelected={state.table.getIsAllPageRowsSelected()}
        someSelected={state.table.getIsSomePageRowsSelected()}
        onToggleAll={(checked) => state.table.toggleAllPageRowsSelected(checked)}
      />
      <tbody>
        <AdvRows
          rows={state.table.getRowModel().rows}
          visibleCols={state.visibleCols}
          selectable={selectable}
          padClass={DENSITY_CELL_PADDING[state.density]}
          emptyMessage={props.emptyMessage ?? "暂无匹配记录"}
        />
      </tbody>
    </table>
  </div>
);

const AdvHeaderStack = <TData extends object>({
  props,
  state,
  matchedRows,
  selectedRows,
}: {
  props: AdvancedDataTableProps<TData>;
  state: ReturnType<typeof useAdvancedTable<TData>>;
  matchedRows: TData[];
  selectedRows: TData[];
}) => (
  <>
    <AdvancedTopToolbar
      title={props.title}
      description={props.description}
      query={state.query}
      onQueryChange={state.setQuery}
      density={state.density}
      onDensityChange={state.setDensity}
      columns={props.columns}
      hiddenIds={state.hiddenIds}
      onToggleColumn={(id, vis) => state.setHiddenIds((prev) => ({ ...prev, [id]: !vis }))}
      onExport={
        props.onExportCsv
          ? () => props.onExportCsv?.(buildCsv(state.visibleCols, matchedRows), matchedRows)
          : undefined
      }
    />
    <FacetFilterBar
      facets={props.facets ?? []}
      activeFacets={state.activeFacets}
      onToggle={(id, val) =>
        state.setActiveFacets((prev) => ({ ...prev, [id]: prev[id] === val ? null : val }))
      }
      onReset={() => state.setActiveFacets({})}
    />
    <BatchActionBar
      selectedRows={selectedRows}
      actions={props.batchActions ?? []}
      onClear={() => state.setRowSelection({})}
    />
  </>
);

export const AdvancedDataTable = <TData extends object>(props: AdvancedDataTableProps<TData>) => {
  const state = useAdvancedTable(props);
  const matchedRows = state.table.getFilteredRowModel().rows.map((r) => r.original);
  const selectedRows = state.table.getSelectedRowModel().rows.map((r) => r.original);

  return (
    <div
      data-slot="advanced-data-table"
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-solid border-border bg-card font-sans text-card-foreground shadow-sm",
        props.className,
      )}
    >
      <AdvHeaderStack
        props={props}
        state={state}
        matchedRows={matchedRows}
        selectedRows={selectedRows}
      />
      <AdvTableGrid
        props={props}
        state={state}
        selectable={(props.batchActions?.length ?? 0) > 0}
      />
      <AdvFooter
        pageIndex={state.table.state.pagination.pageIndex}
        pageCount={state.table.getPageCount()}
        totalCount={matchedRows.length}
        canPrev={state.table.getCanPreviousPage()}
        canNext={state.table.getCanNextPage()}
        onPrev={() => state.table.previousPage()}
        onNext={() => state.table.nextPage()}
      />
    </div>
  );
};
