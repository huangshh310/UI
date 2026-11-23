export type AiApprovalRisk = "low" | "medium" | "high";
export type AiApprovalCardVariant = "card" | "compact";

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
  /** 发起请求的智能体或工具来源 */
  agentName?: string;
  /** 命令执行工作目录 */
  workingDir?: string;
  /** 影响范围说明（显示在底部左栏） */
  impact?: string;
  /** 待执行的终端命令或目标摘要 */
  command?: string;
  /** 风险等级 */
  riskLevel?: AiApprovalRisk;
  /** 密度与布局变体 */
  variant?: AiApprovalCardVariant;
  /** 授权策略可选项 */
  options?: AiApprovalOption[];
  /** 批准回调 */
  onApprove?: (selectedOptionId: string) => void;
  /** 拒绝回调 */
  onReject?: () => void;
  /** 自定义类名 */
  className?: string;
}
