"use client";

/**
 * AiAgentCockpitBlock：由 AiOrb、AudioWaves、AiReasoning、SegmentedControl 与 NumberFlow 组合的现代多模态智能体工作台。
 */
import { cn } from "@matt-ui/utils";
import { Send } from "lucide-react";
import { useState } from "react";
import { AiOrb } from "../ai-orb/index.js";
import { AiReasoning } from "../ai-reasoning/index.js";
import { AudioWaves } from "../audio-waves/index.js";
import { NumberFlow } from "../number-flow/index.js";
import { SegmentedControl } from "../segmented-control/index.js";
import type { AiAgentCockpitBlockProps, AiCockpitMode } from "./ai-agent-cockpit-block.types.js";
import {
  COCKPIT_FOCUS_RING,
  COCKPIT_MODES,
  COCKPIT_MODE_META,
  COCKPIT_QUICK_PROMPTS,
  COCKPIT_SURFACE_CLASS,
} from "./ai-agent-cockpit-block.variants.js";

const COCKPIT_DEFAULTS = {
  defaultMode: "chat" as AiCockpitMode,
  variant: "default" as const,
  title: "多模态智能体驾驶舱",
  subtitle: "融合实时语音波形、思维链推理轨迹与物理分段控制器的 AI 工作台。",
  initialTokens: 1420,
  compact: false,
};

const CockpitBrand = ({
  title,
  subtitle,
  mode,
}: {
  title: string;
  subtitle: string;
  mode: AiCockpitMode;
}) => (
  <div className="flex min-w-0 items-center gap-3">
    <AiOrb
      state={mode === "voice" ? "listening" : mode === "research" ? "thinking" : "speaking"}
      variant={mode === "research" ? "lattice" : "aurora"}
      size="sm"
    />
    <div className="min-w-0">
      <p className="m-0 truncate text-sm font-semibold tracking-tight text-foreground">{title}</p>
      <p className="m-0 mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

const CockpitHeader = ({
  title,
  subtitle,
  mode,
  tokens,
  onModeChange,
}: {
  title: string;
  subtitle: string;
  mode: AiCockpitMode;
  tokens: number;
  onModeChange: (next: AiCockpitMode) => void;
}) => {
  const modeMeta = COCKPIT_MODE_META[mode];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-solid border-border pb-4 dark:border-white/10">
      <CockpitBrand title={title} subtitle={subtitle} mode={mode} />
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground/85">
            <span aria-hidden="true" className={cn("size-1.5 rounded-full", modeMeta.dotClass)} />
            <span>{modeMeta.badge}</span>
          </span>
          <span aria-hidden="true" className="opacity-35">
            ·
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums">
            <span>已消耗</span>
            <NumberFlow
              value={tokens}
              suffix=" tok"
              format={{ maximumFractionDigits: 0 }}
              className="font-medium text-foreground"
            />
          </span>
        </div>
        <SegmentedControl
          ariaLabel="智能体模式切换"
          size="sm"
          items={COCKPIT_MODES}
          value={mode}
          onValueChange={(v) => onModeChange(v as AiCockpitMode)}
        />
      </div>
    </div>
  );
};

const QuickPromptLinks = ({ onRun }: { onRun: (text: string) => void }) => (
  <div className="flex flex-wrap items-center gap-1">
    <span className="mr-1 text-[11px] text-muted-foreground">快捷指令</span>
    {COCKPIT_QUICK_PROMPTS.map((prompt) => (
      <button
        key={prompt}
        type="button"
        onClick={() => onRun(prompt)}
        className={cn(
          "cursor-pointer rounded-md border border-solid border-transparent bg-transparent px-2 py-0.5 font-sans text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground dark:hover:bg-white/[0.06]",
          COCKPIT_FOCUS_RING,
        )}
      >
        {prompt}
      </button>
    ))}
  </div>
);

const ComposerBar = ({
  draft,
  lastPrompt,
  onDraftChange,
  onRun,
}: {
  draft: string;
  lastPrompt: string;
  onDraftChange: (next: string) => void;
  onRun: (text: string) => void;
}) => (
  <div className="flex flex-col gap-2.5 border-t border-solid border-border pt-4 dark:border-white/10">
    <div className="flex items-center gap-2">
      <input
        aria-label="输入智能体指令"
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && draft.trim() && onRun(draft.trim())}
        placeholder="输入设计需求、语音听写或架构审查指令…"
        className={cn(
          "h-9 min-w-0 flex-1 rounded-lg border border-solid border-border bg-background px-3 text-xs text-foreground transition-colors placeholder:text-muted-foreground dark:border-white/12 dark:bg-white/[0.03]",
          COCKPIT_FOCUS_RING,
        )}
      />
      <button
        type="button"
        aria-label="执行指令"
        onClick={() => draft.trim() && onRun(draft.trim())}
        className={cn(
          "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-solid border-transparent bg-primary px-3.5 font-sans text-xs font-medium text-primary-foreground transition-opacity hover:opacity-92 active:scale-[0.99]",
          COCKPIT_FOCUS_RING,
        )}
      >
        <Send aria-hidden="true" className="size-3.5" />
        <span>执行</span>
      </button>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <QuickPromptLinks onRun={onRun} />
      <p className="m-0 font-mono text-[11px] text-muted-foreground tabular-nums">
        最近执行：{lastPrompt}
      </p>
    </div>
  </div>
);

const VoicePanel = ({
  voiceActive,
  onVoiceChange,
}: {
  voiceActive: boolean;
  onVoiceChange: (next: boolean) => void;
}) => (
  <div className="flex flex-col gap-3 border-t border-solid border-border pt-4 @2xl:border-t-0 @2xl:border-l @2xl:pt-0 @2xl:pl-5 dark:border-white/10">
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-medium text-foreground">实时语音通道</span>
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full",
            voiceActive ? "bg-signal" : "bg-muted-foreground/40",
          )}
        />
        <span>{voiceActive ? "48kHz · 在线" : "待命"}</span>
      </span>
    </div>
    <AudioWaves
      size="sm"
      bars={10}
      active={voiceActive}
      onActiveChange={onVoiceChange}
      locale="中 / EN"
      transcript={voiceActive ? "正在实时转写你的语音指令…" : undefined}
      className="w-full"
    />
  </div>
);

const useCockpitState = (
  defaultMode: AiCockpitMode,
  initialTokens: number,
  onRunPrompt?: (prompt: string, mode: AiCockpitMode) => void,
) => {
  const [mode, setMode] = useState<AiCockpitMode>(defaultMode);
  const [voiceActive, setVoiceActive] = useState(defaultMode === "voice");
  const [tokens, setTokens] = useState(initialTokens);
  const [draft, setDraft] = useState("");
  const [lastPrompt, setLastPrompt] = useState("已就绪，等待指令输入");
  const handleModeChange = (next: AiCockpitMode) => (
    setMode(next),
    setVoiceActive(next === "voice")
  );
  const runPrompt = (text: string) => {
    setLastPrompt(`[${mode}] ${text}`);
    setTokens((prev) => prev + 380);
    setDraft("");
    onRunPrompt?.(text, mode);
  };
  return {
    mode,
    voiceActive,
    setVoiceActive,
    tokens,
    draft,
    setDraft,
    lastPrompt,
    handleModeChange,
    runPrompt,
  };
};

export const AiAgentCockpitBlock = (props: AiAgentCockpitBlockProps) => {
  const cfg = { ...COCKPIT_DEFAULTS, ...props };
  const c = useCockpitState(cfg.defaultMode, cfg.initialTokens, cfg.onRunPrompt);
  return (
    <div
      data-slot="ai-agent-cockpit-block"
      data-variant={cfg.variant}
      className={cn(
        "@container relative flex w-full flex-col overflow-hidden rounded-xl border border-solid text-card-foreground",
        cfg.compact ? "gap-4 p-4" : "gap-5 p-6",
        COCKPIT_SURFACE_CLASS[cfg.variant],
        cfg.className,
      )}
    >
      <CockpitHeader
        title={cfg.title}
        subtitle={cfg.subtitle}
        mode={c.mode}
        tokens={c.tokens}
        onModeChange={c.handleModeChange}
      />
      <div className="grid grid-cols-1 gap-5 @2xl:grid-cols-2 @2xl:gap-0">
        <div className="@2xl:pr-5">
          <AiReasoning
            variant="inline"
            status={c.mode === "research" ? "thinking" : "completed"}
            defaultExpanded
            className="max-w-none"
          />
        </div>
        <VoicePanel voiceActive={c.voiceActive} onVoiceChange={c.setVoiceActive} />
      </div>
      <ComposerBar
        draft={c.draft}
        lastPrompt={c.lastPrompt}
        onDraftChange={c.setDraft}
        onRun={c.runPrompt}
      />
    </div>
  );
};
