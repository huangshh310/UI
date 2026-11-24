"use client";

/**
 * ModelSelector 浮层内部部件：搜索框、两栏模型列表项（支持厂商分组）、圆角分段思考强度与联网开关。
 */
import { cn } from "@matt-ui/utils";
import { Brain, Check, Code2, Eye, Globe, Search, Zap } from "lucide-react";
import type { ModelCapabilityTag, ModelOption, ReasoningEffort } from "./model-selector.types.js";
import { MODEL_SELECTOR_FOCUS_RING } from "./model-selector.variants.js";

export const DEFAULT_MODELS: ModelOption[] = [
  {
    id: "pro",
    name: "Matt Pro 4",
    provider: "旗舰系列",
    description: "深度架构推理与复杂智能体任务",
    contextWindow: "200K",
    badge: "推荐",
    capabilities: ["reasoning", "code", "vision"],
  },
  {
    id: "flash",
    name: "Matt Flash 3",
    provider: "高速系列",
    description: "毫秒级首字响应，适合日常高频问答",
    contextWindow: "1M",
    speedHint: "极速",
    capabilities: ["fast", "vision"],
  },
  {
    id: "deep",
    name: "Matt Reasoner",
    provider: "推理系列",
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
