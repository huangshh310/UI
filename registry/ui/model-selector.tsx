// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * ModelSelector：紧凑型模型与推理深度浮层选择器（对标 shadcn AI Elements Model Selector）。
 * 基于 Base UI Popover 构建，可直接嵌入 PromptInput 工具栏或对话顶栏。
 */

import { cn } from "@/lib/utils";
import { Popover } from "@base-ui/react/popover";
import { Brain, Check, ChevronDown, Code2, Eye, Globe, Search, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

export type ReasoningEffort = "fast" | "balanced" | "deep";

export type ModelCapabilityTag = "reasoning" | "vision" | "fast" | "code";

export interface ModelOption {
  id: string;
  /** 模型显示名 */
  name: string;
  /** 厂商或系列分组名（如 Anthropic / OpenAI / Google） */
  provider?: string;
  /** 一句话场景定位 */
  description?: string;
  /** 上下文窗口标记（如 200K / 1M） */
  contextWindow?: string;
  /** 能力徽章标签 */
  capabilities?: ModelCapabilityTag[];
}

export interface ModelSelectorValue {
  modelId: string;
  effort: ReasoningEffort;
  webSearch: boolean;
}

export interface ModelSelectorProps {
  /** 可选模型集合 */
  models?: ModelOption[];
  /** 受控模型 ID */
  modelId?: string;
  /** 非受控默认模型 ID */
  defaultModelId?: string;
  /** 受控推理强度 */
  effort?: ReasoningEffort;
  /** 非受控默认推理强度 */
  defaultEffort?: ReasoningEffort;
  /** 是否在浮层底部展示推理强度切换器，默认 true */
  showEffortToggle?: boolean;
  /** 是否展示联网检索快捷开关，默认 true */
  showWebSearchToggle?: boolean;
  /** 非受控初始联网开关状态，默认 false */
  defaultWebSearch?: boolean;
  /** 是否在浮层顶部启用搜索过滤框，默认 true */
  searchable?: boolean;
  /** 任意配置项变更回调 */
  onValueChange?: (next: ModelSelectorValue) => void;
  /** 禁用触发器 */
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}
const DEFAULT_MODELS: ModelOption[] = [
  {
    id: "pro",
    name: "Claude 4.5 Sonnet",
    provider: "Anthropic",
    description: "深度架构推理与复杂智能体任务",
    contextWindow: "200K",
    capabilities: ["reasoning", "code", "vision"],
  },
  {
    id: "flash",
    name: "Gemini 3 Flash",
    provider: "Google",
    description: "毫秒级首字响应，适合日常高频问答",
    contextWindow: "1M",
    capabilities: ["fast", "vision"],
  },
  {
    id: "deep",
    name: "o4 Reasoning",
    provider: "OpenAI",
    description: "多步数理验证与长链路规划",
    contextWindow: "200K",
    capabilities: ["reasoning", "code"],
  },
];

const EFFORT_LABELS: Record<ReasoningEffort, string> = {
  fast: "快速",
  balanced: "均衡",
  deep: "深度",
};

const CAP_ICON: Record<ModelCapabilityTag, typeof Brain> = {
  reasoning: Brain,
  vision: Eye,
  fast: Zap,
  code: Code2,
};

const CAP_LABEL: Record<ModelCapabilityTag, string> = {
  reasoning: "深度推理",
  vision: "视觉理解",
  fast: "极速响应",
  code: "代码专精",
};

const SearchField = ({ query, onChange }: { query: string; onChange: (next: string) => void }) => (
  <div className="flex items-center gap-2 border-b border-solid border-border/80 px-3 py-2">
    <Search aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
    <input
      type="search"
      aria-label="搜索模型"
      value={query}
      placeholder="搜索模型或场景…"
      onChange={(event) => onChange(event.target.value)}
      className="h-6 w-full border-0 bg-transparent font-sans text-xs text-foreground outline-none placeholder:text-muted-foreground"
    />
  </div>
);

const ModelOptionRow = ({
  item,
  active,
  onSelect,
}: {
  item: ModelOption;
  active: boolean;
  onSelect: () => void;
}) => (
  <li>
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl border-0 px-2.5 py-2 text-left transition-colors duration-(--ui-duration-fast) focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        active ? "bg-secondary text-foreground" : "bg-transparent hover:bg-accent/70",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-sans text-xs font-semibold text-foreground">{item.name}</span>
          {item.contextWindow && (
            <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground tabular-nums">
              {item.contextWindow}
            </span>
          )}
          {item.capabilities?.map((cap) => {
            const Icon = CAP_ICON[cap];
            return (
              <span
                key={cap}
                title={CAP_LABEL[cap]}
                className="inline-flex items-center text-muted-foreground"
              >
                <Icon aria-hidden="true" className="size-3" />
              </span>
            );
          })}
        </div>
        {item.description && (
          <p className="m-0 mt-0.5 truncate font-sans text-[11px] text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
      {active && <Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-foreground" />}
    </button>
  </li>
);

const ModelOptionList = ({
  models,
  selectedId,
  onSelect,
}: {
  models: ModelOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  if (models.length === 0) {
    return (
      <p className="m-0 px-3 py-5 text-center text-xs text-muted-foreground">没有匹配的模型</p>
    );
  }
  return (
    <ul
      aria-label="可用模型列表"
      className="m-0 flex max-h-60 list-none flex-col gap-0.5 overflow-y-auto p-1.5"
    >
      {models.map((item) => (
        <ModelOptionRow
          key={item.id}
          item={item}
          active={item.id === selectedId}
          onSelect={() => onSelect(item.id)}
        />
      ))}
    </ul>
  );
};

const EffortSegment = ({
  effort,
  onSelect,
}: {
  effort: ReasoningEffort;
  onSelect: (next: ReasoningEffort) => void;
}) => (
  <fieldset className="m-0 inline-flex items-center gap-0.5 rounded-full border border-solid border-border/80 bg-secondary p-0.5">
    <legend className="sr-only">思考强度</legend>
    {(["fast", "balanced", "deep"] as const).map((level) => (
      <button
        key={level}
        type="button"
        aria-pressed={effort === level}
        onClick={() => onSelect(level)}
        className={cn(
          "cursor-pointer rounded-full border-0 px-2 py-0.5 font-sans text-[11px] font-medium transition-all duration-(--ui-duration-fast) focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          effort === level
            ? "bg-card text-foreground shadow-xs"
            : "bg-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        {EFFORT_LABELS[level]}
      </button>
    ))}
  </fieldset>
);

const SelectorFooter = ({
  showEffort,
  effort,
  onEffortChange,
  showWebSearch,
  webSearch,
  onWebSearchToggle,
}: {
  showEffort: boolean;
  effort: ReasoningEffort;
  onEffortChange: (next: ReasoningEffort) => void;
  showWebSearch: boolean;
  webSearch: boolean;
  onWebSearchToggle: () => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-solid border-border/80 bg-secondary/35 px-2.5 py-2">
    {showEffort && <EffortSegment effort={effort} onSelect={onEffortChange} />}
    {showWebSearch && (
      <button
        type="button"
        aria-pressed={webSearch}
        onClick={onWebSearchToggle}
        className={cn(
          "inline-flex h-6 cursor-pointer items-center gap-1 rounded-full border border-solid px-2 font-sans text-[11px] font-medium transition-colors duration-(--ui-duration-fast) focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          webSearch
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-muted-foreground hover:text-foreground",
        )}
      >
        <Globe aria-hidden="true" className="size-3" />
        <span>联网</span>
      </button>
    )}
  </div>
);
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
