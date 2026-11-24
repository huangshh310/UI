/**
 * AiChatThread 视觉变体与内置示例对话。
 */
import { cva } from "class-variance-authority";
import type { AiChatMessage } from "./ai-chat-thread.types.js";

export const chatThreadVariants = cva("flex w-full flex-col text-card-foreground", {
  variants: {
    variant: {
      card: "gap-5 rounded-xl border border-solid border-border bg-card p-5 shadow-xs dark:border-white/10",
      seamless: "gap-5 bg-transparent p-0",
      compact:
        "gap-3.5 rounded-xl border border-solid border-border bg-card p-3.5 shadow-xs dark:border-white/10",
    },
  },
  defaultVariants: {
    variant: "card",
  },
});

export const CHAT_ACTION_BTN =
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-solid border-transparent bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const CHAT_DEFAULT_MESSAGES: AiChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "周末想去京都待两天，帮我安排一条不赶路、偏咖啡馆和建筑散步的路线？",
    timestamp: "09:41",
  },
  {
    id: "m2",
    role: "assistant",
    model: "Matt Pro",
    timestamp: "09:41",
    meta: "1.2s · 164 tok",
    content:
      "第一天可以从南禅寺一带步行到哲学之道，上午逛完蓝瓶京都店后去冈崎公园看京都市京瓷美术馆；傍晚沿鸭川散步到木屋町吃晚餐，全程平缓好走。",
    variants: [
      "第一天可以从南禅寺一带步行到哲学之道，上午逛完蓝瓶京都店后去冈崎公园看京都市京瓷美术馆；傍晚沿鸭川散步到木屋町吃晚餐，全程平缓好走。",
      "如果你偏爱小众空间，建议把上午留给大山崎山庄美术馆与安藤忠雄地下展厅，下午回到乌丸御池周边慢慢探几家烘焙咖啡馆。",
    ],
  },
];

export const CHAT_DEFAULT_FOLLOWUPS = ["加上第二天行程", "推荐 3 家手冲咖啡馆"];
