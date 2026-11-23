/**
 * AiReasoning 视觉变体、动效参数与默认思维链步骤。
 */
import type { AiReasoningStep, AiReasoningVariant } from "./ai-reasoning.types.js";

export const REASONING_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const REASONING_COLLAPSE_TRANSITION = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const REASONING_DEFAULT_STEPS: AiReasoningStep[] = [
  {
    id: "s1",
    tag: "天气",
    title: "查询京都本周末天气与日落时间",
    detail: "周六多云转晴 21°C，鸭川日落约 17:42，适合户外步行。",
    duration: "0.6s",
  },
  {
    id: "s2",
    tag: "路线",
    title: "按步行距离串联东山与冈崎街区",
    detail: "南禅寺 → 哲学之道 → 京瓷美术馆总步行约 3.2 公里。",
    duration: "0.9s",
  },
  {
    id: "s3",
    tag: "精选",
    title: "筛选高评分手冲咖啡馆与晚餐位置",
    detail: "剔除需长队预约门店，保留三家可直接到店的小馆。",
    duration: "0.5s",
  },
];

export const REASONING_SHELL_CLASS: Record<AiReasoningVariant, string> = {
  card: "rounded-xl border border-solid border-border bg-card text-card-foreground shadow-xs dark:border-white/10",
  ghost:
    "rounded-xl border border-solid border-border/70 bg-muted/40 text-card-foreground dark:border-white/10 dark:bg-white/[0.03]",
  inline: "rounded-lg border-0 bg-transparent text-foreground",
};
