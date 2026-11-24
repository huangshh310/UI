/**
 * AgentScreen 的样式映射（对标 BeautifulUI 21 Agent Screen 极简暗色视口框）。
 */
import { cva } from "class-variance-authority";

export const AGENT_SCREEN_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const agentScreenViewportVariants = cva(
  "relative w-full overflow-hidden rounded-2xl border border-solid border-border bg-[#09090b] text-neutral-100 shadow-xs dark:border-white/10",
);

export const agentScreenTabVariants = cva(
  "cursor-pointer rounded-full border border-solid px-2.5 py-0.5 font-sans text-[11px] font-medium transition-colors",
  {
    variants: {
      active: {
        true: "border-border bg-card text-foreground shadow-2xs dark:border-white/14 dark:bg-white/12 dark:text-white",
        false: "border-transparent bg-transparent text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
