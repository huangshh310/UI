/**
 * DataTable 组件的公开类型定义，隔离内部表格状态实现。
 */
import type { ReactNode } from "react";

export type DataTableVariant = "default" | "minimal" | "ghost";
export type DataTableDensity = "compact" | "normal" | "comfortable";

export interface DataTableColumn<TData> {
  /** 列唯一标识 */
  id: string;
  /** 表头标题 */
  header: string;
  /** 提取排序与全局搜索用的纯值 */
  accessor?: (row: TData) => string | number | boolean | null | undefined;
  /** 自定义单元格渲染 */
  cell?: (row: TData) => ReactNode;
  /** 是否允许点击表头排序 */
  sortable?: boolean;
  /** 单元格对齐方式，数值列推荐 right */
  align?: "left" | "center" | "right";
}

export interface DataTableProps<TData> {
  /** 行数据 */
  data: TData[];
  /** 声明式列定义 */
  columns: DataTableColumn<TData>[];
  /** 提取行唯一标识，未提供时使用行索引 */
  getRowId?: (row: TData, index: number) => string;
  /** 表格标题与副标题 */
  title?: string;
  description?: string;
  /** 容器外观风格 */
  variant?: DataTableVariant;
  /** 行高与单元格内边距密度 */
  density?: DataTableDensity;
  /** 是否开启斑马纹交替底色 */
  striped?: boolean;
  /** 是否吸顶表头（配合固定高度容器垂直滚动） */
  stickyHeader?: boolean;
  /** 顶部工具栏右侧扩展槽 */
  toolbarActions?: ReactNode;
  /** 点击行回调（自动忽略复选框与内部按钮点击） */
  onRowClick?: (row: TData) => void;
  /** 是否显示全局搜索输入框 */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** 是否开启多选复选框列 */
  selectable?: boolean;
  /** 选中行变化回调 */
  onSelectionChange?: (rows: TData[]) => void;
  /** 每页条数，默认 5 */
  pageSize?: number;
  /** 加载骨架态 */
  loading?: boolean;
  /** 空数据文案 */
  emptyMessage?: string;
  className?: string;
}
