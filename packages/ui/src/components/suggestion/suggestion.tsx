"use client";

/**
 * Suggestions / Suggestion：无外框灵感启动卡、发丝分隔追问列表与流式追问胶囊组。
 */
import { cn } from "@matt-ui/utils";
import { SuggestionFollowUpList, SuggestionsCardsPanel } from "./suggestion-parts.js";
import type { SuggestionItem, SuggestionProps, SuggestionsProps } from "./suggestion.types.js";
import { suggestionPillVariants } from "./suggestion.variants.js";

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
