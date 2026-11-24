/**
 * AgentScreen 的类型定义。
 */
import type { ComponentProps, ReactNode } from "react";

/** 智能体屏幕运行状态：working 实况工作中、loading 建立连接中 */
export type AgentScreenStatus = "working" | "loading";

export interface AgentScreenProps extends Omit<ComponentProps<"section">, "title"> {
  /** 当前屏幕状态，默认 "loading" */
  status?: AgentScreenStatus;
  /** 底部标题，默认 "智能体屏幕" */
  title?: string;
  /** 连接中态的居中提示文案，默认 "正在连接智能体屏幕" */
  loadingLabel?: string;
  /** 工作态左上角可选实况步骤说明（如正在浏览的页面或动作） */
  activityLabel?: string;
  /** 视口宽高比，默认 "16 / 10" */
  aspectRatio?: string;
  /** 右侧可选扩展操作按钮（如接管控制、全屏打开） */
  actions?: ReactNode;
  /** 点击底栏状态切换胶囊时的回调；传入时显示「运行中 / 连接中」切换器 */
  onStatusChange?: (status: AgentScreenStatus) => void;
}
