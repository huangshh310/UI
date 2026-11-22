// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiModelSelector：C 端 AI 模型、推理强度与联网/沙箱能力配置面板（参考 ChatGPT / Claude / Cursor）。
 */

import { cn } from "@/lib/utils";
import { Brain, Check, Code2, Eye, Globe, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

export type AiReasoningEffort = "fast" | "balanced" | "deep";

export interface AiModelOption {
  id: string;
  name: string;
  tagline: string;
  contextLabel: string;
  tier: "pro" | "flash" | "vision";
}

export interface AiModelConfig {
  modelId: string;
  effort: AiReasoningEffort;
  capabilities: string[];
}

export interface AiModelSelectorProps {
  /** 可选模型列表 */
  models?: AiModelOption[];
  /** 初始选中模型 */
  defaultModelId?: string;
  /** 初始推理深度 */
  defaultEffort?: AiReasoningEffort;
  /** 配置变更回调 */
  onChange?: (config: AiModelConfig) => void;
  /** 自定义类名 */
  className?: string;
}
const DEFAULT_MODELS: AiModelOption[] = [
  {
    id: "pro",
    name: "Matt Pro",
    tagline: "复杂架构推理与多步智能体编排",
    contextLabel: "200K",
    tier: "pro",
  },
  {
    id: "flash",
    name: "Matt Flash",
    tagline: "毫秒级低延迟响应，适合高频交互",
    contextLabel: "128K",
    tier: "flash",
  },
  {
    id: "vision",
    name: "Matt Vision",
    tagline: "界面截图视觉审查与设计稿转代码",
    contextLabel: "128K",
    tier: "vision",
  },
];

const EFFORTS: { id: AiReasoningEffort; label: string }[] = [
  { id: "fast", label: "快速" },
  { id: "balanced", label: "均衡" },
  { id: "deep", label: "深度" },
];

const CAPABILITIES = [
  { id: "web", label: "联网检索", Icon: Globe },
  { id: "sandbox", label: "代码沙箱", Icon: Code2 },
  { id: "memory", label: "长期记忆", Icon: Sparkles },
];

const TIER_META = {
  pro: { Icon: Brain, cls: "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300" },
  flash: { Icon: Zap, cls: "bg-amber-500/14 text-amber-800 dark:text-amber-300" },
  vision: { Icon: Eye, cls: "bg-emerald-500/12 text-emerald-800 dark:text-emerald-300" },
} as const;

const ModelOptionRow = ({
  item,
  active,
  onSelect,
}: {
  item: AiModelOption;
  active: boolean;
  onSelect: () => void;
}) => {
  const { Icon, cls } = TIER_META[item.tier];
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-solid px-3 py-2 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-signal/65 bg-signal/8 shadow-xs"
          : "border-border/75 bg-secondary/25 hover:bg-accent/45",
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-xl", cls)}
        >
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-foreground">{item.name}</span>
            <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {item.contextLabel}
            </span>
          </div>
          <p className="m-0 mt-0.5 truncate text-[11px] text-muted-foreground">{item.tagline}</p>
        </div>
      </div>
      {active && <Check aria-hidden="true" className="size-4 shrink-0 text-signal" />}
    </button>
  );
};

const ModelCardList = ({
  models,
  selectedId,
  onSelect,
}: {
  models: AiModelOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => (
  <div className="flex flex-col gap-1.5">
    {models.map((item) => (
      <ModelOptionRow
        key={item.id}
        item={item}
        active={item.id === selectedId}
        onSelect={() => onSelect(item.id)}
      />
    ))}
  </div>
);

const EffortToggle = ({
  effort,
  onSelect,
}: {
  effort: AiReasoningEffort;
  onSelect: (e: AiReasoningEffort) => void;
}) => (
  <div className="inline-flex items-center gap-0.5 rounded-full border border-solid border-border/80 bg-secondary/75 p-0.5">
    {EFFORTS.map((e) => (
      <button
        key={e.id}
        type="button"
        aria-pressed={effort === e.id}
        onClick={() => onSelect(e.id)}
        className={cn(
          "cursor-pointer rounded-full border-0 px-2.5 py-0.5 font-sans text-[11px] font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
          effort === e.id
            ? "bg-card text-foreground shadow-xs"
            : "bg-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        {e.label}
      </button>
    ))}
  </div>
);

const CapabilityBar = ({ caps, onToggle }: { caps: string[]; onToggle: (id: string) => void }) => (
  <div className="flex flex-wrap items-center gap-1.5 border-t border-solid border-border/70 pt-2.5">
    {CAPABILITIES.map(({ id, label, Icon }) => {
      const on = caps.includes(id);
      return (
        <button
          key={id}
          type="button"
          aria-pressed={on}
          onClick={() => onToggle(id)}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-solid px-2.5 py-1 font-sans text-[11px] font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
            on
              ? "border-blue-600/35 bg-blue-500/10 text-blue-800 dark:border-blue-400/35 dark:bg-blue-400/15 dark:text-blue-200"
              : "border-border bg-secondary/35 text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon aria-hidden="true" className="size-3" />
          <span>{label}</span>
        </button>
      );
    })}
  </div>
);

export const AiModelSelector = ({
  models = DEFAULT_MODELS,
  defaultModelId = "pro",
  defaultEffort = "balanced",
  onChange,
  className,
}: AiModelSelectorProps) => {
  const [modelId, setModelId] = useState(defaultModelId);
  const [effort, setEffort] = useState<AiReasoningEffort>(defaultEffort);
  const [caps, setCaps] = useState<string[]>(["web", "sandbox"]);
  const emit = (m: string, e: AiReasoningEffort, c: string[]) =>
    onChange?.({ modelId: m, effort: e, capabilities: c });
  const toggleCap = (id: string) => {
    const next = caps.includes(id) ? caps.filter((c) => c !== id) : [...caps, id];
    setCaps(next);
    emit(modelId, effort, next);
  };
  return (
    <div
      data-slot="ai-model-selector"
      className={cn(
        "flex w-full max-w-md flex-col gap-3 rounded-[22px] border border-solid border-border/90 bg-card p-4 text-card-foreground shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">模型与推理能力</span>
        <EffortToggle effort={effort} onSelect={(e) => (setEffort(e), emit(modelId, e, caps))} />
      </div>
      <ModelCardList
        models={models}
        selectedId={modelId}
        onSelect={(id) => (setModelId(id), emit(id, effort, caps))}
      />
      <CapabilityBar caps={caps} onToggle={toggleCap} />
    </div>
  );
};
