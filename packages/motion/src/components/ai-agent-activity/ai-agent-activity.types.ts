import type { ReactNode } from "react";

export type AiAgentActivityType =
  | "thinking"
  | "searching"
  | "reading"
  | "writing"
  | "tool_execution"
  | "api_request"
  | "database_query"
  | "code_execution"
  | "completed"
  | "failed"
  | "cancelled";

export type AiAgentActivityStatus = "pending" | "running" | "success" | "error" | "cancelled";

export interface AiAgentActivityDetails {
  input?: string | Record<string, unknown>;
  output?: string | Record<string, unknown>;
  codeSnippet?: string;
  language?: string;
}

export interface AiAgentActivityItemData {
  id: string;
  type: AiAgentActivityType;
  title: string;
  description?: string;
  status: AiAgentActivityStatus;
  duration?: string;
  timestamp?: string;
  metadata?: Record<string, string | number | boolean>;
  details?: AiAgentActivityDetails;
}

export interface AiAgentActivityProps {
  /** 智能体执行步骤列表 */
  activities: AiAgentActivityItemData[];
  /** 是否正处于运行中（页头展示绿色脉动状态） */
  isRunning?: boolean;
  /** 面板标题，默认「执行轨迹」 */
  title?: string;
  /** 可选智能体名称标识 */
  agentName?: string;
  /** 默认展开明细的步骤 ID 列表 */
  defaultExpandedIds?: string[];
  className?: string;
  children?: ReactNode;
}

export interface AiAgentActivityHeaderProps {
  title?: string;
  agentName?: string;
  showControls?: boolean;
  className?: string;
}

export interface AiAgentActivityTimelineProps {
  className?: string;
}

export interface AiAgentActivityItemProps {
  activity: AiAgentActivityItemData;
  isLast?: boolean;
  className?: string;
}
