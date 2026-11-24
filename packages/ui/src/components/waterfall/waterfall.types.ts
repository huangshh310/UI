/**
 * Waterfall 的公开类型定义：多步调用链路追踪与嵌套耗时火焰图契约。
 */

export type WaterfallSpanTone = "default" | "signal" | "success" | "warning" | "destructive";

export interface WaterfallSpan {
  value: string;
  label: string;
  /** 相对起始毫秒数 */
  start: number;
  /** 持续耗时毫秒数 */
  duration: number;
  /** 耗时条语义色调 */
  tone?: WaterfallSpanTone;
  /** 附加指标文案（如 Token 用量、状态码或缓存命中标记） */
  meta?: string;
  /** 嵌套触发的子级调用步骤 */
  children?: WaterfallSpan[];
}

export interface WaterfallMilestone {
  /** 里程碑时刻（毫秒） */
  time: number;
  /** 里程碑标签（如首字到达 TTFT） */
  label: string;
}

export interface WaterfallProps {
  /** 顶层及嵌套追踪步骤数组 */
  items: WaterfallSpan[];
  /** 无障碍树表名称 */
  ariaLabel?: string;
  /** 可选顶部面板标题 */
  title?: string;
  /** 是否展示「全部展开 / 全部折叠」控制按钮 */
  showControls?: boolean;
  /** 步骤列标题，默认「调用步骤」 */
  nameHeader?: string;
  /** 附加指标列标题（传入或步骤含 meta 时显示该列） */
  metaHeader?: string;
  /** 时间轴列无障碍名称，默认「时间轴」 */
  timelineHeader?: string;
  /** 贯穿所有行的时间轴里程碑标记 */
  milestones?: WaterfallMilestone[];
  /** 可视时间范围 [start, end]（毫秒），用于缩放或平移时间窗口 */
  range?: [number, number];
  /** 时间轴最大刻度数，默认 5 */
  maxTicks?: number;
  /** 受控选中步骤 value */
  value?: string | null;
  /** 非受控初始选中步骤 value */
  defaultValue?: string | null;
  /** 选中步骤变化回调 */
  onValueChange?: (value: string | null, span?: WaterfallSpan) => void;
  /** 受控展开步骤 value 列表 */
  expanded?: string[];
  /** 非受控初始展开步骤 value 列表 */
  defaultExpanded?: string[];
  /** 展开步骤变化回调 */
  onExpandedChange?: (expanded: string[]) => void;
  /** 自定义耗时文案格式化函数 */
  formatDuration?: (ms: number) => string;
  className?: string;
}
