"use client";

/**
 * Suggestions 的卡片网格与垂直追问列表子部件。
 */
import { cn } from "@matt-ui/utils";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { useState } from "react";
import type {
  SuggestionItem,
  SuggestionSize,
  SuggestionSurface,
  SuggestionsColumns,
  SuggestionsProps,
} from "./suggestion.types.js";
import {
  SUGGESTIONS_GRID_COLUMNS,
  SUGGESTION_FOCUS_RING,
  suggestionCardVariants,
  suggestionListContainerVariants,
} from "./suggestion.variants.js";

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
          `h-6.5 cursor-pointer rounded-full border border-solid px-2.5 font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast) ${SUGGESTION_FOCUS_RING}`,
          active === cat
            ? "border-border/80 bg-secondary text-foreground shadow-xs dark:border-white/12 dark:bg-white/12"
            : "border-transparent bg-transparent text-muted-foreground hover:bg-accent/60 hover:text-foreground",
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
            <span className="truncate font-sans text-xs font-semibold text-foreground">
              {item.label}
            </span>
            {item.badge && (
              <span className="shrink-0 rounded bg-secondary/85 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground dark:bg-white/10">
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
          className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
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
      `group flex w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent text-left transition-colors duration-(--ui-duration-fast) hover:bg-accent/65 ${SUGGESTION_FOCUS_RING}`,
      size === "sm" ? "px-3 py-2" : "px-3.5 py-2.5",
    )}
  >
    <div className="flex min-w-0 flex-1 items-center gap-2">
      {item.icon ?? (
        <Sparkles aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-foreground">{item.label}</div>
        {item.description && (
          <div className="truncate text-[11px] text-muted-foreground">{item.description}</div>
        )}
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-2">
      {item.badge && (
        <span className="rounded bg-secondary/85 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground dark:bg-white/10">
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

export const SuggestionFollowUpList = ({
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

export const SuggestionsCardsPanel = ({
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
      className={cn("flex w-full max-w-xl flex-col gap-3 font-sans", className)}
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
