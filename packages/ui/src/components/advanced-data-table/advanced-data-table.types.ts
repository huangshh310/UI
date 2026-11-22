/**
 * AdvancedDataTable 组件的类型定义。
 */
import type { DataTableColumn } from "../data-table/index.js";

export type TableDensity = "compact" | "normal" | "comfortable";

export interface AdvancedTableColumn<TData> extends DataTableColumn<TData> {
  /** 是否默认隐藏该列 */
  defaultHidden?: boolean;
  /** 是否允许在列显隐面板中隐藏，默认 true */
  hideable?: boolean;
}

export interface AdvancedTableFacet<TData> {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  getValue: (row: TData) => string;
}

export interface AdvancedTableBatchAction<TData> {
  id: string;
  label: string;
  tone?: "default" | "destructive";
  onAction: (rows: TData[]) => void;
}

export interface AdvancedDataTableProps<TData> {
  data: TData[];
  columns: AdvancedTableColumn<TData>[];
  getRowId?: (row: TData, index: number) => string;
  title?: string;
  description?: string;
  /** 分面筛选分组 */
  facets?: AdvancedTableFacet<TData>[];
  /** 多选批量操作 */
  batchActions?: AdvancedTableBatchAction<TData>[];
  /** 默认行密度 */
  defaultDensity?: TableDensity;
  /** 导出 CSV 回调；传入时显示导出按钮，接收当前过滤后的 CSV 文本与行数据 */
  onExportCsv?: (csv: string, rows: TData[]) => void;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
}
