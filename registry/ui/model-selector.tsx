// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * ModelSelector：紧凑型模型与推理深度浮层选择器（对标 Claude / Cursor / Vercel AI Elements）。
 * 基于 Base UI Popover 构建，提供利落浮层、两栏模型信息、思考强度与联网开关。
 */

import { cn } from "@/lib/utils";
import { Popover } from "@base-ui/react/popover";
import { cva } from "class-variance-authority";
import { Brain, Check, ChevronDown, Code2, Eye, Globe, Search, Zap } from "lucide-react";
import { useState } from "react";

export const MODEL_SELECTOR_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const MODEL_SELECTOR_POPUP_CLASSES =
  "w-80 origin-(--transform-origin) overflow-hidden rounded-xl border border-solid border-border bg-popover/98 text-popover-foreground shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-[transform,opacity] duration-(--ui-duration-normal) ease-(--ui-ease-out) outline-none data-ending-style:-translate-y-1 data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:-translate-y-1 data-starting-style:scale-[0.97] data-starting-style:opacity-0 dark:border-white/10 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]";

export const modelSelectorTriggerVariants = cva(
  `group inline-flex cursor-pointer items-center gap-1.5 border border-solid font-sans font-medium text-foreground select-none transition-[background-color,border-color] duration-(--ui-duration-fast) data-popup-open:border-foreground/20 data-popup-open:bg-accent/60 disabled:pointer-events-none disabled:opacity-50 ${MODEL_SELECTOR_FOCUS_RING}`,
  {
    variants: {
      variant: {
        pill: "rounded-full border-border bg-card shadow-xs hover:border-foreground/20 hover:bg-accent/50 dark:border-white/10 dark:hover:border-white/20",
        ghost:
          "rounded-lg border-transparent bg-transparent hover:bg-accent/60 data-popup-open:border-border dark:hover:bg-white/8",
        glass:
          "rounded-full border-border bg-popover/90 shadow-xs backdrop-blur-xl hover:border-foreground/20 dark:border-white/10 dark:bg-popover/80",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "pill",
      size: "md",
    },
  },
);
export type ReasoningEffort = "fast" | "balanced" | "deep";

export type ModelCapabilityTag = "reasoning" | "vision" | "fast" | "code";

export type ModelSelectorVariant = "pill" | "ghost" | "glass";

export type ModelSelectorSize = "sm" | "md";

export type ModelSelectorAlign = "start" | "center" | "end";

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
  /** 可选短标签（如 "推荐" / "New"） */
  badge?: string;
  /** 可选吞吐或延迟提示（如 "~90 tok/s"） */
  speedHint?: string;
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
  /** 触发器视觉变体：pill 发丝胶囊、ghost 无框顶栏切换器、glass 毛玻璃胶囊，默认 pill */
  variant?: ModelSelectorVariant;
  /** 触发器尺寸密度，默认 md */
  size?: ModelSelectorSize;
  /** 浮层水平对齐方式，默认 start */
  align?: ModelSelectorAlign;
  /** 是否按 provider 字段分组展示模型列表，默认 false */
  groupByProvider?: boolean;
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
    badge: "推荐",
    capabilities: ["reasoning", "code", "vision"],
  },
  {
    id: "flash",
    name: "Gemini 3 Flash",
    provider: "Google",
    description: "毫秒级首字响应，适合日常高频问答",
    contextWindow: "1M",
    speedHint: "极速",
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
  <div className="flex items-center gap-2 border-b border-solid border-border px-3 py-2 dark:border-white/10">
    <Search aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
    <input
      type="search"
      aria-label="搜索模型"
      value={query}
      placeholder="搜索模型、厂商或场景…"
      onChange={(event) => onChange(event.target.value)}
      className="h-6 w-full border-0 bg-transparent font-sans text-xs text-foreground outline-none placeholder:text-muted-foreground/75"
    />
  </div>
);

const ModelMetaColumn = ({ item, active }: { item: ModelOption; active: boolean }) => (
  <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
    <div className="flex items-center gap-1.5">
      {item.contextWindow && (
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {item.contextWindow}
        </span>
      )}
      <span className="inline-flex size-3.5 items-center justify-center">
        {active && <Check aria-hidden="true" className="size-3.5 text-foreground" />}
      </span>
    </div>
    {item.capabilities && item.capabilities.length > 0 && (
      <div className="flex items-center gap-1 text-muted-foreground/80">
        {item.capabilities.map((cap) => {
          const Icon = CAP_ICON[cap];
          return (
            <span key={cap} title={CAP_LABEL[cap]} className="inline-flex items-center">
              <Icon aria-hidden="true" className="size-3" />
            </span>
          );
        })}
      </div>
    )}
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
        `flex w-full cursor-pointer items-start justify-between gap-3 rounded-lg border border-solid px-2.5 py-2 text-left transition-colors duration-(--ui-duration-fast) ${MODEL_SELECTOR_FOCUS_RING}`,
        active
          ? "border-border bg-secondary/80 text-foreground dark:border-white/10 dark:bg-white/10"
          : "border-transparent bg-transparent hover:bg-accent/55",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-sans text-xs font-medium text-foreground">
            {item.name}
          </span>
          {item.badge && (
            <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground dark:bg-white/10">
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p className="m-0 mt-0.5 truncate font-sans text-[11px] leading-snug text-muted-foreground">
            {item.description}
            {item.speedHint ? ` · ${item.speedHint}` : ""}
          </p>
        )}
      </div>
      <ModelMetaColumn item={item} active={active} />
    </button>
  </li>
);

const groupModelsByProvider = (models: ModelOption[]) => {
  const map = new Map<string, ModelOption[]>();
  for (const item of models) {
    const key = item.provider ?? "其他模型";
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return Array.from(map.entries());
};

const GroupedModelList = ({
  models,
  selectedId,
  onSelect,
}: {
  models: ModelOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => (
  <div
    aria-label="按厂商分组的可用模型"
    className="flex max-h-64 flex-col gap-2 overflow-y-auto p-1.5"
  >
    {groupModelsByProvider(models).map(([provider, group]) => (
      <div key={provider} className="flex flex-col gap-0.5">
        <span className="px-2.5 pt-1 font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
          {provider}
        </span>
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
          {group.map((item) => (
            <ModelOptionRow
              key={item.id}
              item={item}
              active={item.id === selectedId}
              onSelect={() => onSelect(item.id)}
            />
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const ModelOptionList = ({
  models,
  selectedId,
  groupByProvider,
  onSelect,
}: {
  models: ModelOption[];
  selectedId: string;
  groupByProvider: boolean;
  onSelect: (id: string) => void;
}) => {
  if (models.length === 0) {
    return (
      <p className="m-0 px-3 py-5 text-center text-xs text-muted-foreground">没有匹配的模型</p>
    );
  }
  if (groupByProvider) {
    return <GroupedModelList models={models} selectedId={selectedId} onSelect={onSelect} />;
  }
  return (
    <ul
      aria-label="可用模型列表"
      className="m-0 flex max-h-64 list-none flex-col gap-0.5 overflow-y-auto p-1.5"
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
  <fieldset className="m-0 inline-flex items-center gap-0.5 rounded-lg border border-solid border-border bg-muted/75 p-0.5 dark:border-white/10 dark:bg-white/6">
    <legend className="sr-only">思考强度</legend>
    {(["fast", "balanced", "deep"] as const).map((level) => (
      <button
        key={level}
        type="button"
        aria-pressed={effort === level}
        onClick={() => onSelect(level)}
        className={cn(
          `cursor-pointer rounded-md border border-solid border-transparent px-2 py-0.5 font-sans text-[11px] font-medium transition-colors duration-(--ui-duration-fast) ${MODEL_SELECTOR_FOCUS_RING}`,
          effort === level
            ? "border-border bg-card text-foreground shadow-xs dark:border-white/12 dark:bg-card"
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
  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-solid border-border bg-muted/40 px-2.5 py-2 dark:border-white/10 dark:bg-white/4">
    {showEffort && <EffortSegment effort={effort} onSelect={onEffortChange} />}
    {showWebSearch && (
      <button
        type="button"
        aria-pressed={webSearch}
        onClick={onWebSearchToggle}
        className={cn(
          `inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg border border-solid px-2.5 font-sans text-[11px] font-medium transition-colors duration-(--ui-duration-fast) ${MODEL_SELECTOR_FOCUS_RING}`,
          webSearch
            ? "border-primary bg-primary text-primary-foreground shadow-xs"
            : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground dark:border-white/10",
        )}
      >
        <Globe aria-hidden="true" className="size-3" />
        <span>联网</span>
      </button>
    )}
  </div>
);
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
