// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiPromptGallery：C 端 AI 灵感冒泡与场景提示词卡网格，支持分类筛选与一键注入指令。
 */

import { cn } from "@/lib/utils";
import { ArrowUpRight, Code2, Globe, Palette, Sparkles } from "lucide-react";
import { useState } from "react";

export interface AiPromptTemplate {
  id: string;
  category: string;
  title: string;
  prompt: string;
  tone: "signal" | "violet" | "emerald" | "amber";
}

export interface AiPromptGalleryProps {
  /** 提示词模板卡片列表 */
  templates?: AiPromptTemplate[];
  /** 点击模板卡片回调 */
  onSelect?: (template: AiPromptTemplate) => void;
  /** 自定义类名 */
  className?: string;
}
const DEFAULT_TEMPLATES: AiPromptTemplate[] = [
  {
    id: "design",
    category: "设计",
    title: "重构 C 端高光层次",
    prompt: "为浅色与深色主题生成带镜面内高光和扩散阴影的 OKLCH 令牌体系。",
    tone: "signal",
  },
  {
    id: "code",
    category: "编程",
    title: "生成无障碍组件测试",
    prompt: "围绕键盘导航与焦点环编写 Vitest 与 Playwright 双主题 axe 校验用例。",
    tone: "violet",
  },
  {
    id: "research",
    category: "调研",
    title: "对比交互底座方案",
    prompt: "评估 Base UI 与 @ui-sdk/react 在命令面板、树与拖拽排序上的边界差异。",
    tone: "emerald",
  },
  {
    id: "copy",
    category: "写作",
    title: "起草版本发布日志",
    prompt: "把 15 款新增 AI 与智能体组件的亮点提炼成简洁有温度的 C 端发布说明。",
    tone: "amber",
  },
];

const TONE_META = {
  signal: { Icon: Palette, cls: "bg-blue-500/12 text-blue-700 dark:text-blue-300" },
  violet: { Icon: Code2, cls: "bg-violet-500/12 text-violet-700 dark:text-violet-300" },
  emerald: { Icon: Globe, cls: "bg-emerald-500/12 text-emerald-800 dark:text-emerald-300" },
  amber: { Icon: Sparkles, cls: "bg-amber-500/14 text-amber-800 dark:text-amber-300" },
} as const;

const PromptCard = ({
  item,
  picked,
  onPick,
}: {
  item: AiPromptTemplate;
  picked: boolean;
  onPick: () => void;
}) => {
  const { Icon, cls } = TONE_META[item.tone];
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "group flex cursor-pointer flex-col gap-2 rounded-2xl border border-solid p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
        picked
          ? "border-signal/65 bg-signal/8 shadow-xs"
          : "border-border/80 bg-secondary/25 hover:border-signal/35 hover:bg-card",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={cn("inline-flex size-7 items-center justify-center rounded-xl", cls)}>
          <Icon aria-hidden="true" className="size-3.5" />
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal"
        />
      </div>
      <div>
        <p className="m-0 text-xs font-semibold text-foreground">{item.title}</p>
        <p className="m-0 mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {item.prompt}
        </p>
      </div>
    </button>
  );
};

const CategoryTabs = ({
  categories,
  activeCat,
  onSelect,
}: {
  categories: string[];
  activeCat: string;
  onSelect: (c: string) => void;
}) => (
  <div className="inline-flex flex-wrap items-center gap-1 rounded-full border border-solid border-border/80 bg-secondary/70 p-0.5">
    {categories.map((cat) => (
      <button
        key={cat}
        type="button"
        aria-pressed={activeCat === cat}
        onClick={() => onSelect(cat)}
        className={cn(
          "cursor-pointer rounded-full border-0 px-2.5 py-0.5 font-sans text-[11px] font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
          activeCat === cat
            ? "bg-card text-foreground shadow-xs"
            : "bg-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        {cat}
      </button>
    ))}
  </div>
);

export const AiPromptGallery = ({
  templates = DEFAULT_TEMPLATES,
  onSelect,
  className,
}: AiPromptGalleryProps) => {
  const categories = ["全部", ...Array.from(new Set(templates.map((t) => t.category)))];
  const [activeCat, setActiveCat] = useState("全部");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const visible =
    activeCat === "全部" ? templates : templates.filter((item) => item.category === activeCat);

  return (
    <div
      data-slot="ai-prompt-gallery"
      className={cn(
        "flex w-full max-w-xl flex-col gap-3 rounded-[22px] border border-solid border-border/90 bg-card p-4 text-card-foreground shadow-md",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">场景灵感提示词</span>
        <CategoryTabs categories={categories} activeCat={activeCat} onSelect={setActiveCat} />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {visible.map((item) => (
          <PromptCard
            key={item.id}
            item={item}
            picked={pickedId === item.id}
            onPick={() => (setPickedId(item.id), onSelect?.(item))}
          />
        ))}
      </div>
    </div>
  );
};
