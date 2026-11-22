export type AiPlanStepStatus = "completed" | "running" | "pending";

export interface AiPlanStep {
  id: string;
  title: string;
  tool?: string;
  duration?: string;
  status: AiPlanStepStatus;
}

export interface AiAgentPlanProps {
  /** 任务计划标题 */
  title?: string;
  /** 初始执行步骤 */
  initialSteps?: AiPlanStep[];
  /** 步骤推进回调 */
  onStepAdvance?: (completedCount: number, totalCount: number) => void;
  /** 自定义类名 */
  className?: string;
}
