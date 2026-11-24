export type AiSubagentStatus = "running" | "queued" | "completed" | "stopped" | "failed";

export type AiSubagentsVariant = "card" | "seamless";

export interface AiSubagentStep {
  id: string;
  label: string;
  detail?: string;
  status?: "running" | "done";
}

export interface AiSubagentItem {
  id: string;
  /** 子代理角色前缀（如 Explore / General / Review） */
  role: string;
  /** 当前子任务标题 */
  task: string;
  /** 当前动作或等待提示 */
  activity: string;
  /** 执行状态 */
  status: AiSubagentStatus;
  /** 模型名称标签（如 Haiku 4.5 / Sonnet 4.5） */
  model: string;
  /** 已调用工具次数 */
  toolUses?: number;
  /** 耗时（如 1.4s） */
  duration?: string;
  /** 展开后展示的轨迹步骤 */
  steps?: AiSubagentStep[];
  /** 完成后摘要 */
  summary?: string;
}

export interface AiSubagentsProps {
  /** 受控子代理列表；不传则使用内置演示数据 */
  agents?: AiSubagentItem[];
  /** 非受控初始子代理列表 */
  initialAgents?: AiSubagentItem[];
  /** 总耗时文本，默认 "1s" */
  elapsed?: string;
  /** 是否默认展开列表，默认 true */
  defaultOpen?: boolean;
  /** 容器视觉风格：带轻量卡片边框（card）或无框嵌入对话流（seamless） */
  variant?: AiSubagentsVariant;
  /** 停止单个子代理回调 */
  onStopAgent?: (agentId: string) => void;
  /** 停止全部运行中子代理回调 */
  onStopAll?: () => void;
  /** 自定义类名 */
  className?: string;
}
