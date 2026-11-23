// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Suggestions / Suggestion：无外框灵感启动卡、垂直追问列表与流式追问胶囊组（对标 Vercel AI Elements / Linear）。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, useState } from "react";

export const SUGGESTION_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const SUGGESTIONS_GRID_COLUMNS: Record<SuggestionsColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

export const suggestionPillVariants = cva(
  `inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-solid font-sans font-medium transition-colors duration-(--ui-duration-fast) ${SUGGESTION_FOCUS_RING}`,
  {
    variants: {
      variant: {
        default:
          "border-border bg-card text-foreground shadow-xs hover:border-foreground/20 hover:bg-accent/50 dark:border-white/10 dark:hover:border-white/20",
        ghost:
          "border-transparent bg-secondary/70 text-foreground hover:bg-secondary dark:bg-white/8 dark:hover:bg-white/12",
        signal:
          "border-signal/35 bg-signal/10 text-foreground hover:border-signal/55 hover:bg-signal/15 dark:border-signal/40 dark:bg-signal/14",
      },
      size: {
        sm: "h-7 px-3 text-[11px]",
        md: "h-8 px-3.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const suggestionCardVariants = cva(
  `group flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-solid text-left transition-colors duration-(--ui-duration-fast) ${SUGGESTION_FOCUS_RING}`,
  {
    variants: {
      surface: {
        default:
          "border-border bg-card shadow-xs hover:border-foreground/20 hover:bg-accent/50 dark:border-white/10 dark:hover:border-white/20",
        ghost:
          "border-border/75 bg-secondary/45 hover:border-border hover:bg-secondary/75 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/8",
        glass:
          "border-border bg-popover/90 shadow-xs backdrop-blur-xl hover:border-foreground/20 hover:bg-accent/50 dark:border-white/10 dark:bg-popover/85 dark:hover:border-white/20",
      },
      size: {
        sm: "p-3",
        md: "p-3.5",
      },
    },
    defaultVariants: {
      surface: "default",
      size: "md",
    },
  },
);

export const suggestionListContainerVariants = cva(
  "flex w-full flex-col divide-y divide-border overflow-hidden rounded-xl border border-solid font-sans dark:divide-white/10",
  {
    variants: {
      surface: {
        default: "border-border bg-card shadow-xs dark:border-white/10",
        ghost: "border-border/75 bg-transparent dark:border-white/10",
        glass:
          "border-border bg-popover/90 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-popover/85",
      },
    },
    defaultVariants: {
      surface: "default",
    },
  },
);
export type SuggestionsVariant = "pills" | "cards" | "list";
export type SuggestionSize = "sm" | "md";
export type SuggestionSurface = "default" | "ghost" | "glass";
export type SuggestionPillVariant = "default" | "ghost" | "signal";
export type SuggestionsColumns = 1 | 2 | 3;

export interface SuggestionItem {
  id: string;
  /** 展示标题或胶囊短句 */
  label: string;
  /** 点击后实际提交或回填的完整提示词（省略时回退为 label） */
  prompt?: string;
  /** 卡片或列表形态下的补充说明 */
  description?: string;
  /** 可选分类标签（卡片形态支持按分类筛选） */
  category?: string;
  /** 可选右侧或行尾等宽徽章（如快捷键或推荐标识） */
  badge?: string;
  /** 可选前置图标 */
  icon?: ReactNode;
}

export interface SuggestionsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** 结构化建议项列表（也可直接传 Suggestion 子元素进行复合拼装） */
  items?: SuggestionItem[];
  /** 视觉形态：pills 紧凑追问胶囊条，cards 空态灵感卡片网格，list 简洁追问列表 */
  variant?: SuggestionsVariant;
  /** 尺寸密度，默认 md */
  size?: SuggestionSize;
  /** 容器与卡片表面质感，默认 default */
  surface?: SuggestionSurface;
  /** pills 形态下是否启用单行横向滚动轨道，默认 false */
  scrollable?: boolean;
  /** cards 形态下的桌面栅格列数，默认 2 */
  columns?: SuggestionsColumns;
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
  /** 胶囊外观风格，默认 default */
  variant?: SuggestionPillVariant;
  /** 胶囊尺寸，默认 md */
  size?: SuggestionSize;
  /** 可选尾部等宽徽章 */
  badge?: string;
  /** 前置微图标 */
  icon?: ReactNode;
}
const SuggestionCategoryRow = ({
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
          `h-7 cursor-pointer rounded-lg border border-solid px-2.5 font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast) ${SUGGESTION_FOCUS_RING}`,
          active === cat
            ? "border-border bg-secondary text-foreground shadow-xs dark:border-white/12 dark:bg-white/12"
            : "border-transparent bg-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        )}
      >
        {cat}
      </button>
    ))}
  </div>
);

const SuggestionStarterGrid = ({
  items,
  surface,
  size,
  columns,
  onSelect,
}: {
  items: SuggestionItem[];
  surface: SuggestionSurface;
  size: SuggestionSize;
  columns: SuggestionsColumns;
  onSelect?: (prompt: string, item?: SuggestionItem) => void;
}) => (
  <div className={cn("grid gap-2.5", SUGGESTIONS_GRID_COLUMNS[columns])}>
    {items.map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelect?.(item.prompt ?? item.label, item)}
        className={suggestionCardVariants({ surface, size })}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {item.icon && <span className="shrink-0 text-muted-foreground">{item.icon}</span>}
            <span className="truncate font-sans text-xs font-medium text-foreground">
              {item.label}
            </span>
            {item.badge && (
              <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground dark:bg-white/10">
                {item.badge}
              </span>
            )}
          </div>
          {item.description && (
            <p className="m-0 mt-1 line-clamp-2 font-sans text-[11px] leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
        <ArrowUpRight
          aria-hidden="true"
          className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-colors duration-(--ui-duration-fast) group-hover:text-foreground"
        />
      </button>
    ))}
  </div>
);

const SuggestionListRow = ({
  item,
  size,
  onSelect,
}: {
  item: SuggestionItem;
  size: SuggestionSize;
  onSelect?: (prompt: string, item?: SuggestionItem) => void;
}) => (
  <button
    type="button"
    onClick={() => onSelect?.(item.prompt ?? item.label, item)}
    className={cn(
      `group flex w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent text-left transition-colors duration-(--ui-duration-fast) hover:bg-accent/50 ${SUGGESTION_FOCUS_RING}`,
      size === "sm" ? "px-3 py-2" : "px-3.5 py-2.5",
    )}
  >
    <div className="flex min-w-0 flex-1 items-center gap-2">
      {item.icon && <span className="shrink-0 text-muted-foreground">{item.icon}</span>}
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-foreground">{item.label}</div>
        {item.description && (
          <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {item.description}
          </div>
        )}
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-2">
      {item.badge && (
        <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground dark:bg-white/10">
          {item.badge}
        </span>
      )}
      <ArrowRight
        aria-hidden="true"
        className="size-3.5 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-hover:translate-x-0.5 group-hover:text-foreground"
      />
    </div>
  </button>
);

const SuggestionFollowUpList = ({
  items,
  surface,
  size,
  onSelect,
  className,
  ...props
}: Omit<SuggestionsProps, "variant" | "items" | "surface" | "size"> & {
  items: SuggestionItem[];
  surface: SuggestionSurface;
  size: SuggestionSize;
}) => (
  <div
    data-slot="suggestions"
    data-variant="list"
    className={cn(suggestionListContainerVariants({ surface }), className)}
    {...props}
  >
    {items.map((item) => (
      <SuggestionListRow key={item.id} item={item} size={size} onSelect={onSelect} />
    ))}
  </div>
);

const SuggestionsCardsPanel = ({
  items,
  showCategoryFilter,
  surface,
  size,
  columns,
  onSelect,
  className,
  ...props
}: Omit<SuggestionsProps, "variant" | "items" | "surface" | "size" | "columns"> & {
  items: SuggestionItem[];
  surface: SuggestionSurface;
  size: SuggestionSize;
  columns: SuggestionsColumns;
}) => {
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
      className={cn("flex w-full flex-col gap-3 font-sans", className)}
      {...props}
    >
      {showCategoryFilter && categories.length > 0 && (
        <SuggestionCategoryRow categories={categories} active={activeCat} onSelect={setActiveCat} />
      )}
      <SuggestionStarterGrid
        items={visible}
        surface={surface}
        size={size}
        columns={columns}
        onSelect={onSelect}
      />
    </div>
  );
};
const DEFAULT_SUGGESTION_ITEMS: SuggestionItem[] = [
  {
    id: "arch",
    category: "架构",
    label: "设计无框流式对话状态机",
    description: "贴底滚动锚定、消息分支版本树与中断恢复",
    prompt: "请基于复合组件模式设计一套支持贴底滚动锚定与分支版本切换的对话流组件。",
    badge: "⌘1",
  },
  {
    id: "tokens",
    category: "设计系统",
    label: "核对双主题 OKLCH 对比度",
    description: "验证前景、表面与焦点环的 WCAG AA 合规性",
    prompt: "帮我审查浅色与深色主题下的语义色表面阶梯，确保对比度全部不低于 4.5:1。",
    badge: "⌘2",
  },
  {
    id: "agent",
    category: "智能体",
    label: "编排工具轨迹与内联审批",
    description: "合并连续只读查询，对敏感写操作触发护栏确认",
    prompt: "如何把智能体连续多次文件读取折叠成单行轨迹，并在写操作前插入内联审批？",
    badge: "⌘3",
  },
  {
    id: "test",
    category: "测试",
    label: "生成键盘与屏幕阅读器规约",
    description: "覆盖 IME 组合态防误触、方向键导航与 axe 门禁",
    prompt: "请为多模态输入框编写覆盖中文输入法组合态、斜杠命令与无障碍属性的测试用例。",
    badge: "⌘4",
  },
];

export const Suggestion = ({
  suggestion,
  onSelect,
  variant = "default",
  size = "md",
  badge,
  icon,
  className,
  onClick,
  children,
  ...props
}: SuggestionProps) => (
  <button
    type="button"
    data-slot="suggestion"
    data-variant={variant}
    onClick={(event) => {
      onSelect?.(suggestion);
      onClick?.(event);
    }}
    className={cn(suggestionPillVariants({ variant, size }), className)}
    {...props}
  >
    {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
    <span>{children ?? suggestion}</span>
    {badge && (
      <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground dark:bg-white/10">
        {badge}
      </span>
    )}
  </button>
);

const SuggestionsPillsRail = ({
  items,
  size,
  surface,
  scrollable,
  onSelect,
  className,
  children,
  ...rest
}: Omit<SuggestionsProps, "variant" | "items" | "columns" | "showCategoryFilter"> & {
  items: SuggestionItem[];
}) => {
  const pillVariant = surface === "ghost" ? "ghost" : "default";
  return (
    <div
      data-slot="suggestions"
      data-variant="pills"
      className={cn(
        "flex w-full items-center gap-2 font-sans",
        scrollable ? "flex-nowrap overflow-x-auto pb-1" : "flex-wrap",
        className,
      )}
      {...rest}
    >
      {children ??
        items.map((item) => (
          <Suggestion
            key={item.id}
            size={size}
            variant={pillVariant}
            badge={item.badge}
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

const resolveSuggestionsConfig = (props: SuggestionsProps) => ({
  items: props.items ?? (props.children ? [] : DEFAULT_SUGGESTION_ITEMS),
  surface: props.surface ?? "default",
  size: props.size ?? "md",
  columns: props.columns ?? 2,
  showCategoryFilter: props.showCategoryFilter ?? true,
  scrollable: props.scrollable ?? false,
});

export const Suggestions = (props: SuggestionsProps) => {
  const {
    items: _i,
    variant,
    size: _s,
    surface: _sf,
    scrollable: _sc,
    columns: _c,
    onSelect,
    showCategoryFilter: _f,
    className,
    children,
    ...rest
  } = props;
  const cfg = resolveSuggestionsConfig(props);
  const shared = {
    items: cfg.items,
    surface: cfg.surface,
    size: cfg.size,
    onSelect,
    className,
    ...rest,
  };

  if (variant === "cards" && !children) {
    return (
      <SuggestionsCardsPanel
        {...shared}
        showCategoryFilter={cfg.showCategoryFilter}
        columns={cfg.columns}
      />
    );
  }
  if (variant === "list" && !children) {
    return <SuggestionFollowUpList {...shared} />;
  }
  return (
    <SuggestionsPillsRail {...shared} scrollable={cfg.scrollable}>
      {children}
    </SuggestionsPillsRail>
  );
};
