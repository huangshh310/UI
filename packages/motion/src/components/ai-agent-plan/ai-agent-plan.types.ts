export type AiPlanStepStatus = "completed" | "running" | "pending" | "failed" | "skipped";
export type AiAgentPlanVariant = "card" | "timeline" | "compact";

export interface AiPlanStep {
  id: string;
  title: string;
  /** 可选步骤补充说明 */
  detail?: string;
  tool?: string;
  duration?: string;
  status: AiPlanStepStatus;
}

export interface AiAgentPlanProps {
  /** 任务计划标题 */
  title?: string;
  /** 副标题或运行环境标识（如 "Matt Pro · Autonomous"） */
  subtitle?: string;
  /** 视觉布局形态：标准卡片（card）、时间轴轨道（timeline）或紧凑面板（compact） */
  variant?: AiAgentPlanVariant;
  /** 是否显示底部步进控制栏 */
  showControls?: boolean;
  /** 初始执行步骤 */
  initialSteps?: AiPlanStep[];
  /** 步骤推进回调 */
  onStepAdvance?: (completedCount: number, totalCount: number) => void;
  /** 自定义类名 */
  className?: string;
}
