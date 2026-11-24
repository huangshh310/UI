/**
 * AiApprovalCard 视觉变体与风险等级映射表。
 */
import { cva } from "class-variance-authority";
import type { AiApprovalOption, AiApprovalRisk } from "./ai-approval-card.types.js";

export const approvalCardVariants = cva(
  "flex w-full flex-col overflow-hidden rounded-2xl border border-solid border-border bg-card text-card-foreground shadow-xs",
  {
    variants: {
      variant: {
        card: "",
        compact: "",
      },
    },
    defaultVariants: {
      variant: "card",
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
  { label: string; dotClass: string; badgeClass: string; iconWrapClass: string }
> = {
  low: {
    label: "低风险",
    dotClass: "bg-emerald-600 dark:bg-emerald-400",
    badgeClass: "bg-emerald-500/12 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200",
    iconWrapClass:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  medium: {
    label: "需确认",
    dotClass: "bg-amber-600 dark:bg-amber-400",
    badgeClass: "bg-amber-500/12 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200",
    iconWrapClass: "bg-amber-500/10 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
  high: {
    label: "高危操作",
    dotClass: "bg-rose-600 dark:bg-rose-400",
    badgeClass: "bg-rose-500/12 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200",
    iconWrapClass: "bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  },
};
