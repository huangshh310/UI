export type StatsPeriod = "7d" | "30d" | "quarter";

export interface StatsOverviewBlockProps {
  /** 默认周期 */
  defaultPeriod?: StatsPeriod;
  /** 自定义类名 */
  className?: string;
}
