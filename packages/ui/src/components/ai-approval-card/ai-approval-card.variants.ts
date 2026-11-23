/**
 * AiApprovalCard 视觉变体与风险等级映射表。
 */
import { cva } from "class-variance-authority";
import type { AiApprovalOption, AiApprovalRisk } from "./ai-approval-card.types.js";

export const approvalCardVariants = cva(
  "flex w-full max-w-md flex-col border border-solid bg-card text-card-foreground shadow-xs",
  {
    variants: {
      variant: {
        card: "gap-3.5 rounded-2xl p-5",
        compact: "gap-2.5 rounded-xl p-4",
      },
      riskLevel: {
        low: "border-border/85",
        medium: "border-amber-500/35",
        high: "border-destructive/40",
      },
    },
    defaultVariants: {
      variant: "card",
      riskLevel: "medium",
    },
  },
);

export const APPROVAL_DEFAULT_OPTIONS: AiApprovalOption[] = [
  { id: "once", label: "单次授权并记录审计日志", description: "仅对本次 Agent 调用生效。" },
  {
    id: "session",
    label: "当前会话内自动放行同类命令",
    description: "会话结束后自动回收权限。",
  },
];

export const APPROVAL_RISK_META: Record<
  AiApprovalRisk,
  { label: string; iconClass: string; pillClass: string }
> = {
  low: {
    label: "低风险",
    iconClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    pillClass: "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  },
  medium: {
    label: "需确认",
    iconClass: "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300",
    pillClass: "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300",
  },
  high: {
    label: "高危操作",
    iconClass: "border-destructive/30 bg-destructive/10 text-destructive",
    pillClass: "border-destructive/35 bg-destructive/12 text-destructive",
  },
};
