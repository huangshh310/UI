export type DashboardShellVariant = "default" | "inset" | "minimal";

export interface DashboardKpiItem {
  label: string;
  value: string;
  delta: string;
  tone?: "success" | "secondary";
}

export interface DashboardShellBlockProps {
  /** 工作区名称 */
  workspaceName?: string;
  /** 工作区环境标识，显示在侧边栏标题下方 */
  workspaceTier?: string;
  /** 视觉布局变体：标准发丝框架、内嵌画布或极简无底色侧栏 */
  variant?: DashboardShellVariant;
  /** 初始是否折叠侧边栏 */
  defaultCollapsed?: boolean;
  /** 紧凑内边距密度 */
  compact?: boolean;
  /** 右上角主操作按钮文案，默认「新建发布」 */
  primaryActionLabel?: string;
  /** 自定义顶部 KPI 指标卡片 */
  kpis?: DashboardKpiItem[];
  /** 点击右上角主操作按钮的回调 */
  onPrimaryAction?: () => void;
  /** 切换侧边导航分组时的回调 */
  onNavChange?: (navId: string) => void;
  /** 自定义容器类名 */
  className?: string;
}
