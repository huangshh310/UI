"use client";

/**
 * ModelSelector 浮层内部部件：搜索框、模型列表项（支持厂商分组）、思考强度分段开关与联网开关。
 */
import { cn } from "@matt-ui/utils";
import { Brain, Check, Code2, Eye, Globe, Search, Zap } from "lucide-react";
import type { ModelCapabilityTag, ModelOption, ReasoningEffort } from "./model-selector.types.js";
import { MODEL_SELECTOR_FOCUS_RING } from "./model-selector.variants.js";

export const DEFAULT_MODELS: ModelOption[] = [
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

export const EFFORT_LABELS: Record<ReasoningEffort, string> = {
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

export const SearchField = ({
  query,
  onChange,
}: {
  query: string;
  onChange: (next: string) => void;
}) => (
  <div className="flex items-center gap-2 border-b border-solid border-border/75 px-3 py-2 dark:border-white/10">
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

const ModelOptionBadges = ({ item }: { item: ModelOption }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <span className="font-sans text-xs font-semibold text-foreground">{item.name}</span>
    {item.badge && (
      <span className="rounded-md border border-solid border-signal/35 bg-signal/10 px-1.5 py-0.2 font-mono text-[10px] font-medium text-signal">
        {item.badge}
      </span>
    )}
    {item.contextWindow && (
      <span className="rounded-md border border-solid border-border/65 bg-secondary/75 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground tabular-nums dark:border-white/8 dark:bg-white/8">
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
        `flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl border border-solid px-2.5 py-2 text-left transition-colors duration-(--ui-duration-fast) ${MODEL_SELECTOR_FOCUS_RING}`,
        active
          ? "border-border/75 bg-secondary/90 text-foreground dark:border-white/10 dark:bg-white/10"
          : "border-transparent bg-transparent hover:bg-accent/70",
      )}
    >
      <div className="min-w-0 flex-1">
        <ModelOptionBadges item={item} />
        {item.description && (
          <p className="m-0 mt-0.5 truncate font-sans text-[11px] text-muted-foreground">
            {item.description}
            {item.speedHint ? ` · ${item.speedHint}` : ""}
          </p>
        )}
      </div>
      {active && <Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-signal" />}
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
    className="flex max-h-68 flex-col gap-2 overflow-y-auto p-1.5"
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

export const ModelOptionList = ({
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
  <fieldset className="m-0 inline-flex items-center gap-0.5 rounded-full border border-solid border-border/75 bg-secondary/80 p-0.5 dark:border-white/10 dark:bg-white/7">
    <legend className="sr-only">思考强度</legend>
    {(["fast", "balanced", "deep"] as const).map((level) => (
      <button
        key={level}
        type="button"
        aria-pressed={effort === level}
        onClick={() => onSelect(level)}
        className={cn(
          `cursor-pointer rounded-full border border-solid border-transparent px-2 py-0.5 font-sans text-[11px] font-medium transition-all duration-(--ui-duration-fast) ${MODEL_SELECTOR_FOCUS_RING}`,
          effort === level
            ? "border-border/65 bg-card text-foreground shadow-xs dark:border-white/12 dark:bg-card"
            : "bg-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        {EFFORT_LABELS[level]}
      </button>
    ))}
  </fieldset>
);

export const SelectorFooter = ({
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
  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-solid border-border/75 bg-secondary/35 px-2.5 py-2 dark:border-white/10 dark:bg-white/4">
    {showEffort && <EffortSegment effort={effort} onSelect={onEffortChange} />}
    {showWebSearch && (
      <button
        type="button"
        aria-pressed={webSearch}
        onClick={onWebSearchToggle}
        className={cn(
          `inline-flex h-6 cursor-pointer items-center gap-1 rounded-full border border-solid px-2 font-sans text-[11px] font-medium transition-colors duration-(--ui-duration-fast) ${MODEL_SELECTOR_FOCUS_RING}`,
          webSearch
            ? "border-primary bg-primary text-primary-foreground shadow-xs"
            : "border-border/80 bg-card text-muted-foreground hover:text-foreground dark:border-white/12",
        )}
      >
        <Globe aria-hidden="true" className="size-3" />
        <span>联网</span>
      </button>
    )}
  </div>
);
