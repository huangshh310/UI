export type StatsPeriod = "7d" | "30d" | "quarter";

export type StatsOverviewVariant = "cards" | "bento" | "minimal";

export type StatsOverviewColumns = 2 | 4;

export interface StatsOverviewBlockProps {
  /** 默认周期 */
  defaultPeriod?: StatsPeriod;
  /** 视觉呈现变体 */
  variant?: StatsOverviewVariant;
  /** 桌面端网格列数 */
  columns?: StatsOverviewColumns;
  /** 是否启用紧凑密度 */
  compact?: boolean;
  /** 区块标题 */
  title?: string;
  /** 区块副标题 */
  description?: string;
  /** 切换周期时的回调 */
  onPeriodChange?: (period: StatsPeriod) => void;
  /** 自定义类名 */
  className?: string;
}
