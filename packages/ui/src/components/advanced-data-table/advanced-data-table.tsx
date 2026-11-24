"use client";

/**
 * AdvancedDataTable：内置多选分面筛选弹层、毛玻璃列显隐控制、
 * 行密度切换、斑马纹、多列骨架态、批量操作栏与 CSV 导出钩子的高级数据表格。
 */
import { cn } from "@matt-ui/utils";
import {
  useTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import type {
  AdvancedDataTableProps,
  AdvancedTableColumn,
  AdvancedTableFacet,
  TableDensity,
} from "./advanced-data-table.types.js";
import {
  advancedTableShellVariants,
  buildCsv,
  DENSITY_CELL_PADDING,
} from "./advanced-data-table.variants.js";
import {
  ADV_TABLE_FEATURES,
  AdvHead,
  AdvRows,
  type AdvTableFeatures,
} from "./advanced-table-body.js";
import {
  AdvancedControlBar,
  AdvancedHeaderBar,
  BatchActionBar,
} from "./advanced-table-controls.js";
import { FacetFilterGroup } from "./advanced-table-facets.js";
import { AdvFooter } from "./advanced-table-footer.js";

const applyFacets = <TData extends object>(
  data: TData[],
  facets: AdvancedTableFacet<TData>[] | undefined,
  active: Record<string, string[]>,
) =>
  facets?.length
    ? data.filter((row) =>
        facets.every((facet) => {
          const picked = active[facet.id];
          return !picked?.length || picked.includes(facet.getValue(row));
        }),
      )
    : data;

const toggleFacetOption = (
  prev: Record<string, string[]>,
  facetId: string,
  val: string,
): Record<string, string[]> => {
  const current = prev[facetId] ?? [];
  const next = current.includes(val) ? current.filter((item) => item !== val) : [...current, val];
  return { ...prev, [facetId]: next };
};

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

const initHidden = <TData extends object>(columns: AdvancedTableColumn<TData>[]) =>
  Object.fromEntries(columns.filter((c) => c.defaultHidden).map((c) => [c.id, true]));

const useAdvancedTable = <TData extends object>(props: AdvancedDataTableProps<TData>) => {
  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [density, setDensity] = useState<TableDensity>(props.defaultDensity ?? "normal");
  const [activeFacets, setActiveFacets] = useState<Record<string, string[]>>({});
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
  hasActiveFilters,
}: {
  props: AdvancedDataTableProps<TData>;
  state: ReturnType<typeof useAdvancedTable<TData>>;
  selectable: boolean;
  hasActiveFilters: boolean;
}) => (
  <div
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    tabIndex={0}
    aria-label={props.title ?? "高级数据表格"}
    className="w-full overflow-x-auto outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset"
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
      <tbody className="divide-y divide-border/70 dark:divide-white/7">
        <AdvRows
          rows={state.table.getRowModel().rows}
          visibleCols={state.visibleCols}
          selectable={selectable}
          striped={Boolean(props.striped)}
          loading={Boolean(props.loading)}
          padClass={DENSITY_CELL_PADDING[state.density]}
          emptyMessage={props.emptyMessage ?? "暂无匹配记录"}
          hasActiveFilters={hasActiveFilters}
          onClearAllFilters={() => {
            state.setQuery("");
            state.setActiveFacets({});
          }}
          onRowClick={props.onRowClick}
        />
      </tbody>
    </table>
  </div>
);

const renderFacetControls = <TData extends object>(
  props: AdvancedDataTableProps<TData>,
  state: ReturnType<typeof useAdvancedTable<TData>>,
) =>
  props.facets?.length ? (
    <FacetFilterGroup
      data={props.data}
      facets={props.facets}
      activeFacets={state.activeFacets}
      onToggle={(id, val) => state.setActiveFacets((prev) => toggleFacetOption(prev, id, val))}
      onClearFacet={(id) => state.setActiveFacets((prev) => ({ ...prev, [id]: [] }))}
      onResetAll={() => state.setActiveFacets({})}
    />
  ) : undefined;

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
}) => {
  const onExport = props.onExportCsv
    ? () => props.onExportCsv?.(buildCsv(state.visibleCols, matchedRows), matchedRows)
    : undefined;

  return (
    <>
      <AdvancedHeaderBar
        title={props.title}
        description={props.description}
        toolbarActions={props.toolbarActions}
        onExport={onExport}
      />
      <AdvancedControlBar
        hasHeader={Boolean(props.title || props.description)}
        searchable={props.searchable ?? true}
        searchPlaceholder={props.searchPlaceholder ?? "搜索关键字…"}
        showDensityToggle={props.showDensityToggle ?? true}
        toolbarActions={props.toolbarActions}
        facetControls={renderFacetControls(props, state)}
        query={state.query}
        onQueryChange={state.setQuery}
        density={state.density}
        onDensityChange={state.setDensity}
        columns={props.columns}
        hiddenIds={state.hiddenIds}
        onToggleColumn={(id, vis) => state.setHiddenIds((prev) => ({ ...prev, [id]: !vis }))}
        onExport={onExport}
      />
      <BatchActionBar
        selectedRows={selectedRows}
        actions={props.batchActions ?? []}
        onClear={() => state.setRowSelection({})}
      />
    </>
  );
};

export const AdvancedDataTable = <TData extends object>(props: AdvancedDataTableProps<TData>) => {
  const state = useAdvancedTable(props);
  const matchedRows = state.table.getFilteredRowModel().rows.map((r) => r.original);
  const selectedRows = state.table.getSelectedRowModel().rows.map((r) => r.original);
  const variant = props.variant ?? "default";
  const hasActiveFilters =
    state.query.length > 0 || Object.values(state.activeFacets).some((list) => list.length > 0);

  return (
    <div
      data-slot="advanced-data-table"
      data-variant={variant}
      className={cn(advancedTableShellVariants({ variant }), props.className)}
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
        hasActiveFilters={hasActiveFilters}
      />
      <AdvFooter
        pageIndex={state.table.state.pagination.pageIndex}
        pageCount={state.table.getPageCount()}
        pageSize={state.table.state.pagination.pageSize}
        totalCount={matchedRows.length}
        selectedCount={selectedRows.length}
        canPrev={state.table.getCanPreviousPage()}
        canNext={state.table.getCanNextPage()}
        onPrev={() => state.table.previousPage()}
        onNext={() => state.table.nextPage()}
      />
    </div>
  );
};
