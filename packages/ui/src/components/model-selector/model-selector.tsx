"use client";

/**
 * ModelSelector：紧凑型模型与推理深度浮层选择器（对标 Claude / Cursor / Vercel AI Elements）。
 * 基于 Base UI Popover 构建，提供利落浮层、两栏模型信息、思考强度与联网开关。
 */
import { Popover } from "@base-ui/react/popover";
import { cn } from "@matt-ui/utils";
import { ChevronDown, Globe } from "lucide-react";
import { useState } from "react";
import {
  DEFAULT_MODELS,
  EFFORT_LABELS,
  ModelOptionList,
  SearchField,
  SelectorFooter,
} from "./model-selector-parts.js";
import type { ModelOption, ModelSelectorProps, ReasoningEffort } from "./model-selector.types.js";
import {
  MODEL_SELECTOR_POPUP_CLASSES,
  modelSelectorTriggerVariants,
} from "./model-selector.variants.js";

const filterModels = (models: ModelOption[], query: string) => {
  const kw = query.trim().toLowerCase();
  if (!kw) return models;
  return models.filter((m) =>
    `${m.name} ${m.provider ?? ""} ${m.description ?? ""}`.toLowerCase().includes(kw),
  );
};

const findModelName = (models: ModelOption[], modelId: string) =>
  (models.find((m) => m.id === modelId) ?? models[0])?.name ?? "Model";

const useSelectorState = (props: ModelSelectorProps) => {
  const models = props.models ?? DEFAULT_MODELS;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [innerModel, setInnerModel] = useState(props.defaultModelId ?? models[0]?.id ?? "pro");
  const [innerEffort, setInnerEffort] = useState<ReasoningEffort>(
    props.defaultEffort ?? "balanced",
  );
  const [webSearch, setWebSearch] = useState(props.defaultWebSearch ?? false);

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
  webSearch,
  hasCustomAria,
}: {
  modelName: string;
  showEffort: boolean;
  effort: ReasoningEffort;
  webSearch: boolean;
  hasCustomAria: boolean;
}) => (
  <>
    {!hasCustomAria && <span className="sr-only">选择模型：</span>}
    <span className="max-w-36 truncate">{modelName}</span>
    {showEffort && (
      <span className="font-normal text-muted-foreground">· {EFFORT_LABELS[effort]}</span>
    )}
    {webSearch && <Globe aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />}
    <ChevronDown
      aria-hidden="true"
      className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-data-popup-open:rotate-180"
    />
  </>
);

const resolveSelectorUi = (props: ModelSelectorProps) => ({
  variant: props.variant ?? "pill",
  size: props.size ?? "md",
  align: props.align ?? "start",
  showEffort: props.showEffortToggle ?? true,
  showWebSearch: props.showWebSearchToggle ?? true,
  searchable: props.searchable ?? true,
  groupByProvider: props.groupByProvider ?? false,
});

const SelectorPopupContent = ({
  s,
  ui,
}: {
  s: ReturnType<typeof useSelectorState>;
  ui: ReturnType<typeof resolveSelectorUi>;
}) => (
  <Popover.Popup className={MODEL_SELECTOR_POPUP_CLASSES}>
    {ui.searchable && <SearchField query={s.query} onChange={s.setQuery} />}
    <ModelOptionList
      models={s.filtered}
      selectedId={s.modelId}
      groupByProvider={ui.groupByProvider}
      onSelect={s.selectModel}
    />
    {(ui.showEffort || ui.showWebSearch) && (
      <SelectorFooter
        showEffort={ui.showEffort}
        effort={s.effort}
        onEffortChange={s.selectEffort}
        showWebSearch={ui.showWebSearch}
        webSearch={s.webSearch}
        onWebSearchToggle={s.toggleWeb}
      />
    )}
  </Popover.Popup>
);

export const ModelSelector = (props: ModelSelectorProps) => {
  const s = useSelectorState(props);
  const ui = resolveSelectorUi(props);

  return (
    <Popover.Root open={s.open} onOpenChange={s.handleOpenChange}>
      <Popover.Trigger
        disabled={props.disabled}
        data-slot="model-selector"
        data-variant={ui.variant}
        aria-label={props["aria-label"]}
        className={cn(
          modelSelectorTriggerVariants({ variant: ui.variant, size: ui.size }),
          props.className,
        )}
      >
        <TriggerLabel
          modelName={s.modelName}
          showEffort={ui.showEffort}
          effort={s.effort}
          webSearch={ui.showWebSearch && s.webSearch}
          hasCustomAria={Boolean(props["aria-label"])}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          sideOffset={8}
          align={ui.align}
          className="z-(--ui-z-popover) outline-none"
        >
          <SelectorPopupContent s={s} ui={ui} />
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};
