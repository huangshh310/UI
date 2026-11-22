export type AiApprovalRisk = "low" | "medium" | "high";

export interface AiApprovalOption {
  id: string;
  label: string;
  description?: string;
}

export interface AiApprovalCardProps {
  /** 审批主标题 */
  title: string;
  /** 补充背景说明 */
  description?: string;
  /** 待执行的终端命令或目标摘要 */
  command?: string;
  /** 风险等级 */
  riskLevel?: AiApprovalRisk;
  /** 授权策略可选项 */
  options?: AiApprovalOption[];
  /** 批准回调 */
  onApprove?: (selectedOptionId: string) => void;
  /** 拒绝回调 */
  onReject?: () => void;
  /** 自定义类名 */
  className?: string;
}
