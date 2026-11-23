"use client";

/**
 * ModelSelector 浮层内部部件：搜索框、模型列表项、思考强度分段开关与联网开关。
 */
import { cn } from "@matt-ui/utils";
import { Brain, Check, Code2, Eye, Globe, Search, Zap } from "lucide-react";
import type { ModelCapabilityTag, ModelOption, ReasoningEffort } from "./model-selector.types.js";

export const DEFAULT_MODELS: ModelOption[] = [
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
        active ? "bg-signal/10 text-foreground" : "bg-transparent hover:bg-accent/70",
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
      {active && <Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-signal" />}
    </button>
  </li>
);

export const ModelOptionList = ({
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
            ? "border-signal/40 bg-signal/12 text-signal"
            : "border-border bg-card text-muted-foreground hover:text-foreground",
        )}
      >
        <Globe aria-hidden="true" className="size-3" />
        <span>联网</span>
      </button>
    )}
  </div>
);
