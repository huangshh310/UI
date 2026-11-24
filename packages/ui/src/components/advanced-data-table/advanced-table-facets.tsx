"use client";

/**
 * AdvancedDataTable 分面筛选弹层部件：采用虚线胶囊触发按钮与多选计数浮层模式。
 */
import { Popover } from "@base-ui/react/popover";
import { cn } from "@matt-ui/utils";
import { Check, PlusCircle, X } from "lucide-react";
import type { AdvancedTableFacet } from "./advanced-data-table.types.js";
import {
  ADV_FACET_BTN,
  ADV_FOCUS_RING,
  ADV_POPOVER_CLASSES,
} from "./advanced-data-table.variants.js";

const countOptionMatches = <TData extends object>(
  data: TData[],
  facets: AdvancedTableFacet<TData>[],
  activeFacets: Record<string, string[]>,
  targetFacet: AdvancedTableFacet<TData>,
) => {
  const counts = new Map<string, number>();
  for (const row of data) {
    const passesOthers = facets.every((f) => {
      if (f.id === targetFacet.id) return true;
      const picked = activeFacets[f.id];
      return !picked?.length || picked.includes(f.getValue(row));
    });
    if (!passesOthers) continue;
    const val = targetFacet.getValue(row);
    counts.set(val, (counts.get(val) ?? 0) + 1);
  }
  return counts;
};

const SelectedBadges = ({
  options,
  selected,
}: {
  options: { value: string; label: string }[];
  selected: string[];
}) => {
  if (selected.length === 0) return null;
  const labels = options.filter((o) => selected.includes(o.value)).map((o) => o.label);
  return (
    <>
      <span aria-hidden="true" className="mx-0.5 h-3.5 w-px bg-border dark:bg-white/15" />
      {labels.length > 2 ? (
        <span className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-[11px] leading-none font-medium text-secondary-foreground tabular-nums">
          已选 {labels.length} 项
        </span>
      ) : (
        <span className="inline-flex items-center gap-1">
          {labels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-[11px] leading-none font-medium text-secondary-foreground"
            >
              {label}
            </span>
          ))}
        </span>
      )}
    </>
  );
};

const FacetOptionRow = ({
  label,
  checked,
  count,
  onSelect,
}: {
  label: string;
  checked: boolean;
  count: number;
  onSelect: () => void;
}) => (
  <button
    type="button"
    aria-pressed={checked}
    onClick={onSelect}
    className={cn(
      "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-solid border-transparent bg-transparent px-2 py-1.5 text-left font-sans text-xs text-foreground transition-colors duration-(--ui-duration-instant) hover:bg-accent/70",
      ADV_FOCUS_RING,
    )}
  >
    <span className="flex min-w-0 items-center gap-2">
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border border-solid transition-colors duration-(--ui-duration-instant)",
          checked ? "border-signal bg-signal text-signal-foreground" : "border-input bg-card",
        )}
      >
        {checked && <Check className="size-2.5 stroke-[2.75]" />}
      </span>
      <span className="truncate font-medium">{label}</span>
    </span>
    <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
      {count}
    </span>
  </button>
);

const FacetClearFooter = ({ onClear }: { onClear: () => void }) => (
  <div className="mt-1.5 border-t border-solid border-border/80 pt-1.5 dark:border-white/10">
    <button
      type="button"
      onClick={onClear}
      className={cn(
        "flex w-full cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent py-1.5 font-sans text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground",
        ADV_FOCUS_RING,
      )}
    >
      清除此项筛选
    </button>
  </div>
);

const FacetPopoverItem = <TData extends object>(p: {
  facet: AdvancedTableFacet<TData>;
  selected: string[];
  counts: Map<string, number>;
  onToggle: (value: string) => void;
  onClearFacet: () => void;
}) => (
  <Popover.Root>
    <Popover.Trigger
      className={cn(
        ADV_FACET_BTN,
        p.selected.length > 0 && "border-solid border-foreground/20 bg-card dark:border-white/20",
      )}
    >
      <PlusCircle aria-hidden="true" className="size-3.5 text-muted-foreground" />
      <span>{p.facet.label}</span>
      <SelectedBadges options={p.facet.options} selected={p.selected} />
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner sideOffset={6} align="start" className="z-(--ui-z-popover) outline-none">
        <Popover.Popup className={ADV_POPOVER_CLASSES}>
          <p className="m-0 px-2 pt-1 pb-1.5 text-[11px] font-medium text-muted-foreground">
            按{p.facet.label}筛选
          </p>
          <div className="flex flex-col gap-0.5">
            {p.facet.options.map((opt) => (
              <FacetOptionRow
                key={opt.value}
                label={opt.label}
                checked={p.selected.includes(opt.value)}
                count={p.counts.get(opt.value) ?? 0}
                onSelect={() => p.onToggle(opt.value)}
              />
            ))}
          </div>
          {p.selected.length > 0 && <FacetClearFooter onClear={p.onClearFacet} />}
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
);

export const FacetFilterGroup = <TData extends object>(p: {
  data: TData[];
  facets: AdvancedTableFacet<TData>[];
  activeFacets: Record<string, string[]>;
  onToggle: (facetId: string, optionValue: string) => void;
  onClearFacet: (facetId: string) => void;
  onResetAll: () => void;
}) => {
  if (p.facets.length === 0) return null;
  const hasActive = Object.values(p.activeFacets).some((list) => list.length > 0);
  return (
    <>
      {p.facets.map((facet) => (
        <FacetPopoverItem
          key={facet.id}
          facet={facet}
          selected={p.activeFacets[facet.id] ?? []}
          counts={countOptionMatches(p.data, p.facets, p.activeFacets, facet)}
          onToggle={(val) => p.onToggle(facet.id, val)}
          onClearFacet={() => p.onClearFacet(facet.id)}
        />
      ))}
      {hasActive && (
        <button
          type="button"
          onClick={p.onResetAll}
          className={cn(
            "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-solid border-transparent bg-transparent px-2 font-sans text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
            ADV_FOCUS_RING,
          )}
        >
          重置
          <X aria-hidden="true" className="size-3.5" />
        </button>
      )}
    </>
  );
};
