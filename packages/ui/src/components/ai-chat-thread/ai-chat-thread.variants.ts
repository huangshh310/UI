/**
 * AiChatThread 视觉变体与内置 HextaUI 风格示例对话。
 */
import { cva } from "class-variance-authority";
import type { AiChatMessage } from "./ai-chat-thread.types.js";

export const chatThreadVariants = cva("relative flex w-full flex-col text-card-foreground", {
  variants: {
    variant: {
      card: "gap-5 rounded-2xl border border-solid border-border bg-card p-5 shadow-xs dark:border-white/10",
      seamless: "gap-5 bg-transparent p-0",
      compact:
        "gap-3.5 rounded-2xl border border-solid border-border bg-card p-4 shadow-xs dark:border-white/10",
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
    divider: "已切换至 Nova 3 Max",
    content: "搜索框应该用防抖（debounce）还是节流（throttle）？",
    timestamp: "09:41",
  },
  {
    id: "m2",
    role: "assistant",
    model: "Nova 3 Max · High",
    timestamp: "09:41",
    meta: "1.4s · 164 tok",
    thinking: {
      duration: "3s",
      defaultOpen: true,
      steps: [
        {
          title: "对比两者触发时机",
          detail: "两者都能控制搜索请求频率，但触发节点截然不同。",
        },
        {
          title: "确认搜索框的核心诉求",
          detail: "用户停止输入后的最终关键词才是真正需要查询的值。",
        },
      ],
    },
    webSearch: {
      query: "debounce vs throttle search input",
      resultsCount: 3,
      duration: "1.4s",
    },
    content:
      "搜索场景优先使用防抖（debounce）。用户连续键入时只在停顿后发起一次查询；而节流（throttle）按固定周期触发，更适合滚动监听与窗口缩放。同时保持输入框本身即时响应，仅延迟背后的网络请求。",
    citations: [
      { monogram: "M", label: "MDN" },
      { monogram: "C", label: "CSS-Tricks" },
      { monogram: "W", label: "web.dev" },
    ],
    table: {
      headers: ["", "Debounce", "Throttle"],
      rows: [
        ["触发方式", "停顿后执行一次", "活跃期间每 n ms 执行"],
        ["输入 “react” 请求数", "1", "2–3"],
        ["最佳场景", "搜索、自动保存、校验", "滚动、缩放、拖拽"],
      ],
    },
    variants: [
      "搜索场景优先使用防抖（debounce）。用户连续键入时只在停顿后发起一次查询；而节流（throttle）按固定周期触发，更适合滚动监听与窗口缩放。同时保持输入框本身即时响应，仅延迟背后的网络请求。",
      "若希望输入体验更丝滑，推荐 250ms 防抖配合 AbortController 取消过期请求，既省流量又避免乱序回包覆盖最新结果。",
    ],
  },
];

export const CHAT_DEFAULT_FOLLOWUPS = ["加上第二天行程", "如何取消进行中的请求？"];
