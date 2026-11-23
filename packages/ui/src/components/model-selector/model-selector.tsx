"use client";

/**
 * ModelSelector：紧凑型模型与推理深度浮层选择器（对标 shadcn AI Elements Model Selector）。
 * 基于 Base UI Popover 构建，可直接嵌入 PromptInput 工具栏或对话顶栏。
 */
import { Popover } from "@base-ui/react/popover";
import { cn } from "@matt-ui/utils";
import { ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  DEFAULT_MODELS,
  EFFORT_LABELS,
  ModelOptionList,
  SearchField,
  SelectorFooter,
} from "./model-selector-parts.js";
import type { ModelOption, ModelSelectorProps, ReasoningEffort } from "./model-selector.types.js";

const POPUP_CLASSES = cn(
  "w-76 origin-(--transform-origin) overflow-hidden rounded-2xl border border-solid border-border bg-popover text-popover-foreground shadow-lg outline-none",
  "transition-[transform,opacity] duration-(--ui-duration-normal) ease-(--ui-ease-out)",
  "data-starting-style:-translate-y-1 data-starting-style:scale-97 data-starting-style:opacity-0",
  "data-ending-style:-translate-y-1 data-ending-style:scale-97 data-ending-style:opacity-0",
);

const TRIGGER_CLASSES = cn(
  "group inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-border bg-card px-2.5 font-sans text-xs font-medium text-foreground shadow-xs select-none",
  "transition-[background-color,border-color] duration-(--ui-duration-fast) hover:border-foreground/20 hover:bg-accent data-popup-open:border-ring/70 data-popup-open:bg-accent",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
);

const filterModels = (models: ModelOption[], query: string) => {
  const kw = query.trim().toLowerCase();
  if (!kw) return models;
  return models.filter((m) =>
    `${m.name} ${m.provider ?? ""} ${m.description ?? ""}`.toLowerCase().includes(kw),
  );
};

const resolveSelectorDefaults = (props: ModelSelectorProps, models: ModelOption[]) => ({
  initialModel: props.defaultModelId ?? models[0]?.id ?? "pro",
  initialEffort: props.defaultEffort ?? ("balanced" as ReasoningEffort),
  initialWeb: props.defaultWebSearch ?? false,
});

const findModelName = (models: ModelOption[], modelId: string) =>
  (models.find((m) => m.id === modelId) ?? models[0])?.name ?? "Model";

const useSelectorState = (props: ModelSelectorProps) => {
  const models = props.models ?? DEFAULT_MODELS;
  const defaults = resolveSelectorDefaults(props, models);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [innerModel, setInnerModel] = useState(defaults.initialModel);
  const [innerEffort, setInnerEffort] = useState<ReasoningEffort>(defaults.initialEffort);
  const [webSearch, setWebSearch] = useState(defaults.initialWeb);

  const modelId = props.modelId ?? innerModel;
  const effort = props.effort ?? innerEffort;
  const emit = (m: string, e: ReasoningEffort, w: boolean) =>
    props.onValueChange?.({ modelId: m, effort: e, webSearch: w });

  return {
    open,
    query,
    setQuery,
    modelId,
    effort,
    webSearch,
    filtered: filterModels(models, query),
    modelName: findModelName(models, modelId),
    handleOpenChange: (next: boolean) => {
      setOpen(next);
      if (!next) setQuery("");
    },
    selectModel: (nextModel: string) => {
      if (props.modelId === undefined) setInnerModel(nextModel);
      emit(nextModel, effort, webSearch);
      setOpen(false);
      setQuery("");
    },
    selectEffort: (nextEffort: ReasoningEffort) => {
      if (props.effort === undefined) setInnerEffort(nextEffort);
      emit(modelId, nextEffort, webSearch);
    },
    toggleWeb: () => {
      const nextWeb = !webSearch;
      setWebSearch(nextWeb);
      emit(modelId, effort, nextWeb);
    },
  };
};

const TriggerLabel = ({
  modelName,
  showEffort,
  effort,
  hasCustomAria,
}: {
  modelName: string;
  showEffort: boolean;
  effort: ReasoningEffort;
  hasCustomAria: boolean;
}) => (
  <>
    {!hasCustomAria && <span className="sr-only">选择模型：</span>}
    <Sparkles aria-hidden="true" className="size-3.5 text-signal" />
    <span className="max-w-34 truncate">{modelName}</span>
    {showEffort && (
      <span className="rounded-full bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
        {EFFORT_LABELS[effort]}
      </span>
    )}
    <ChevronDown
      aria-hidden="true"
      className="size-3.5 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-data-popup-open:rotate-180"
    />
  </>
);

export const ModelSelector = (props: ModelSelectorProps) => {
  const s = useSelectorState(props);
  const showEffort = props.showEffortToggle ?? true;
  const showWebSearch = props.showWebSearchToggle ?? true;
  const searchable = props.searchable ?? true;

  return (
    <Popover.Root open={s.open} onOpenChange={s.handleOpenChange}>
      <Popover.Trigger
        disabled={props.disabled}
        data-slot="model-selector"
        aria-label={props["aria-label"]}
        className={cn(TRIGGER_CLASSES, props.className)}
      >
        <TriggerLabel
          modelName={s.modelName}
          showEffort={showEffort}
          effort={s.effort}
          hasCustomAria={Boolean(props["aria-label"])}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          sideOffset={8}
          align="start"
          className="z-(--ui-z-popover) outline-none"
        >
          <Popover.Popup className={POPUP_CLASSES}>
            {searchable && <SearchField query={s.query} onChange={s.setQuery} />}
            <ModelOptionList models={s.filtered} selectedId={s.modelId} onSelect={s.selectModel} />
            {(showEffort || showWebSearch) && (
              <SelectorFooter
                showEffort={showEffort}
                effort={s.effort}
                onEffortChange={s.selectEffort}
                showWebSearch={showWebSearch}
                webSearch={s.webSearch}
                onWebSearchToggle={s.toggleWeb}
              />
            )}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};
