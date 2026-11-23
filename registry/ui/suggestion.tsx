// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Suggestions / Suggestion：无外框灵感启动卡与流式追问胶囊组（对标 shadcn AI Elements Suggestion）。
 * 支持紧凑横向胶囊（variant="pills"）与空态场景卡片网格（variant="cards"）。
 */

import { cn } from "@/lib/utils";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, useState } from "react";

export type SuggestionsVariant = "pills" | "cards";

export interface SuggestionItem {
  id: string;
  /** 展示标题或胶囊短句 */
  label: string;
  /** 点击后实际提交或回填的完整提示词（省略时回退为 label） */
  prompt?: string;
  /** 卡片形态下的补充说明 */
  description?: string;
  /** 可选分类标签（卡片形态支持按分类筛选） */
  category?: string;
  /** 可选前置图标 */
  icon?: ReactNode;
}

export interface SuggestionsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** 结构化建议项列表（也可直接传 Suggestion 子元素进行复合拼装） */
  items?: SuggestionItem[];
  /** 视觉形态：pills 紧凑追问胶囊条，cards 空态灵感卡片网格 */
  variant?: SuggestionsVariant;
  /** 选中某条建议时的回调，返回对应的完整 prompt 文本与原始条目 */
  onSelect?: (prompt: string, item?: SuggestionItem) => void;
  /** 是否在卡片形态顶部展示分类筛选胶囊，默认 true */
  showCategoryFilter?: boolean;
}

export interface SuggestionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** 该建议对应的提示词文本 */
  suggestion: string;
  /** 点击选中回调 */
  onSelect?: (suggestion: string) => void;
  /** 前置微图标 */
  icon?: ReactNode;
}
const DEFAULT_ITEMS: SuggestionItem[] = [
  {
    id: "arch",
    category: "架构",
    label: "设计无框流式对话状态机",
    description: "贴底滚动锚定、消息分支版本树与中断恢复",
    prompt: "请基于复合组件模式设计一套支持贴底滚动锚定与分支版本切换的对话流组件。",
  },
  {
    id: "tokens",
    category: "设计系统",
    label: "核对双主题 OKLCH 对比度",
    description: "验证前景、表面与焦点环的 WCAG AA 合规性",
    prompt: "帮我审查浅色与深色主题下的语义色表面阶梯，确保对比度全部不低于 4.5:1。",
  },
  {
    id: "agent",
    category: "智能体",
    label: "编排工具轨迹与内联审批",
    description: "合并连续只读查询，对敏感写操作触发护栏确认",
    prompt: "如何把智能体连续多次文件读取折叠成单行轨迹，并在写操作前插入内联审批？",
  },
  {
    id: "test",
    category: "测试",
    label: "生成键盘与屏幕阅读器规约",
    description: "覆盖 IME 组合态防误触、方向键导航与 axe 门禁",
    prompt: "请为多模态输入框编写覆盖中文输入法组合态、斜杠命令与无障碍属性的测试用例。",
  },
];

export const Suggestion = ({
  suggestion,
  onSelect,
  icon,
  className,
  onClick,
  children,
  ...props
}: SuggestionProps) => (
  <button
    type="button"
    data-slot="suggestion"
    onClick={(event) => {
      onSelect?.(suggestion);
      onClick?.(event);
    }}
    className={cn(
      "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-border/85 bg-card px-3.5 font-sans text-xs font-medium text-foreground shadow-xs",
      "transition-[transform,border-color,background-color] duration-(--ui-duration-fast) hover:-translate-y-0.5 hover:border-signal/40 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-98",
      className,
    )}
    {...props}
  >
    {icon ?? <Sparkles aria-hidden="true" className="size-3 text-signal" />}
    <span>{children ?? suggestion}</span>
  </button>
);

const CategoryFilterRow = ({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string;
  onSelect: (cat: string) => void;
}) => (
  <div className="flex flex-wrap items-center gap-1">
    {categories.map((cat) => (
      <button
        key={cat}
        type="button"
        aria-pressed={active === cat}
        onClick={() => onSelect(cat)}
        className={cn(
          "h-6.5 cursor-pointer rounded-full border-0 px-2.5 font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast) focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          active === cat
            ? "bg-secondary text-foreground"
            : "bg-transparent text-muted-foreground hover:bg-accent/60 hover:text-foreground",
        )}
      >
        {cat}
      </button>
    ))}
  </div>
);

const StarterCardGrid = ({
  items,
  onSelect,
}: {
  items: SuggestionItem[];
  onSelect?: (prompt: string, item?: SuggestionItem) => void;
}) => (
  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
    {items.map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelect?.(item.prompt ?? item.label, item)}
        className="group flex cursor-pointer items-start justify-between gap-3 rounded-2xl border border-solid border-border/80 bg-card/85 p-3.5 text-left shadow-xs transition-[transform,border-color,background-color] duration-(--ui-duration-fast) hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {item.icon && <span className="text-signal">{item.icon}</span>}
            <span className="truncate font-sans text-xs font-semibold text-foreground">
              {item.label}
            </span>
          </div>
          {item.description && (
            <p className="m-0 mt-1 line-clamp-2 font-sans text-[11px] leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
        <ArrowUpRight
          aria-hidden="true"
          className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal"
        />
      </button>
    ))}
  </div>
);

const SuggestionsCardsPanel = ({
  items,
  showCategoryFilter,
  onSelect,
  className,
  ...props
}: Omit<SuggestionsProps, "variant" | "items"> & { items: SuggestionItem[] }) => {
  const [activeCat, setActiveCat] = useState("全部");
  const rawCats = Array.from(
    new Set(items.map((i) => i.category).filter((c): c is string => Boolean(c))),
  );
  const categories = rawCats.length > 1 ? ["全部", ...rawCats] : [];
  const visible =
    activeCat === "全部" ? items : items.filter((item) => item.category === activeCat);

  return (
    <div
      data-slot="suggestions"
      data-variant="cards"
      className={cn("flex w-full max-w-xl flex-col gap-3 font-sans", className)}
      {...props}
    >
      {showCategoryFilter && categories.length > 0 && (
        <CategoryFilterRow categories={categories} active={activeCat} onSelect={setActiveCat} />
      )}
      <StarterCardGrid items={visible} onSelect={onSelect} />
    </div>
  );
};

export const Suggestions = ({
  items,
  variant = "pills",
  onSelect,
  showCategoryFilter = true,
  className,
  children,
  ...props
}: SuggestionsProps) => {
  const resolvedItems = items ?? (children ? [] : DEFAULT_ITEMS);

  if (variant === "cards" && !children) {
    return (
      <SuggestionsCardsPanel
        items={resolvedItems}
        showCategoryFilter={showCategoryFilter}
        onSelect={onSelect}
        className={className}
        {...props}
      />
    );
  }

  return (
    <div
      data-slot="suggestions"
      data-variant="pills"
      className={cn("flex w-full flex-wrap items-center gap-2 font-sans", className)}
      {...props}
    >
      {children ??
        resolvedItems.map((item) => (
          <Suggestion
            key={item.id}
            suggestion={item.prompt ?? item.label}
            icon={item.icon}
            onSelect={(prompt) => onSelect?.(prompt, item)}
          >
            {item.label}
          </Suggestion>
        ))}
    </div>
  );
};
