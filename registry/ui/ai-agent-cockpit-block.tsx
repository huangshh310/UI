// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiAgentCockpitBlock：由 AiOrb、AudioWaves、AiReasoning、SegmentedControl 与 NumberFlow 组合的 C 端多模态智能体驾驶舱区块。
 */

import { AiOrb } from "@/components/ui/ai-orb";
import { AiReasoning } from "@/components/ui/ai-reasoning";
import { AudioWaves } from "@/components/ui/audio-waves";
import { NumberFlow } from "@/components/ui/number-flow";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/utils";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";

export const COCKPIT_MODES = [
  { value: "chat", label: "智能对话" },
  { value: "voice", label: "实时语音", badge: "Live" },
  { value: "research", label: "深度研究" },
];

export const COCKPIT_QUICK_PROMPTS = [
  "优化 C 端触感光影",
  "生成 AI 组件对比度报告",
  "同步 89 项 Registry 清单",
];

export const COCKPIT_SURFACE_CLASS: Record<AiCockpitVariant, string> = {
  default: "border-border/80 bg-card shadow-xs dark:border-white/10",
  elevated: "border-border/80 bg-card shadow-md dark:border-white/12",
  studio:
    "border-border/80 bg-card shadow-md ring-1 ring-border/40 dark:border-white/12 dark:ring-white/6",
};

export const COCKPIT_MODE_META: Record<
  AiCockpitMode,
  { badge: string; pillClass: string; dotClass: string }
> = {
  chat: {
    badge: "对话就绪",
    pillClass:
      "border-emerald-600/20 bg-emerald-500/12 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/16 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  voice: {
    badge: "语音通道在线",
    pillClass:
      "border-signal/25 bg-signal/10 text-blue-700 dark:border-signal/35 dark:bg-signal/18 dark:text-blue-300",
    dotClass: "bg-signal",
  },
  research: {
    badge: "深度推理中",
    pillClass:
      "border-amber-600/25 bg-amber-500/14 text-amber-900 dark:border-amber-400/25 dark:bg-amber-500/16 dark:text-amber-200",
    dotClass: "bg-amber-500",
  },
};
export type AiCockpitMode = "chat" | "voice" | "research";

export type AiCockpitVariant = "default" | "elevated" | "studio";

export interface AiAgentCockpitBlockProps {
  /** 初始智能体模式 */
  defaultMode?: AiCockpitMode;
  /** 视觉呈现变体 */
  variant?: AiCockpitVariant;
  /** 驾驶舱标题 */
  title?: string;
  /** 驾驶舱副标题 */
  subtitle?: string;
  /** 初始已消耗 Token 数 */
  initialTokens?: number;
  /** 是否启用紧凑内边距 */
  compact?: boolean;
  /** 点击快捷提示词或发送指令回调 */
  onRunPrompt?: (prompt: string, mode: AiCockpitMode) => void;
  /** 自定义类名 */
  className?: string;
}
const COCKPIT_DEFAULTS = {
  defaultMode: "chat" as AiCockpitMode,
  variant: "default" as const,
  title: "多模态智能体驾驶舱",
  subtitle: "融合实时语音波形、思维链推理轨迹与物理分段控制器的 C 端工作台。",
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
}) => {
  const modeMeta = COCKPIT_MODE_META[mode];
  return (
    <div className="flex items-center gap-3">
      <AiOrb
        state={mode === "voice" ? "listening" : mode === "research" ? "thinking" : "speaking"}
        variant={mode === "research" ? "lattice" : "aurora"}
        size="md"
      />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="m-0 text-base font-semibold tracking-tight text-foreground">{title}</p>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-solid px-2 py-0.5 text-[11px] font-medium",
              modeMeta.pillClass,
            )}
          >
            <span aria-hidden="true" className={cn("size-1.5 rounded-full", modeMeta.dotClass)} />
            <span>{modeMeta.badge}</span>
          </span>
        </div>
        <p className="m-0 mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

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
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-solid border-border/75 pb-4 dark:border-white/10">
    <CockpitBrand title={title} subtitle={subtitle} mode={mode} />
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="flex items-center gap-1.5 rounded-full border border-solid border-border/80 bg-secondary/50 px-3 py-1 text-xs dark:border-white/10 dark:bg-secondary/35">
        <span className="text-muted-foreground">已消耗</span>
        <NumberFlow
          value={tokens}
          suffix=" tok"
          format={{ maximumFractionDigits: 0 }}
          className="font-semibold text-foreground"
        />
      </div>
      <SegmentedControl
        ariaLabel="智能体模式切换"
        items={COCKPIT_MODES}
        value={mode}
        onValueChange={(v) => onModeChange(v as AiCockpitMode)}
      />
    </div>
  </div>
);

const QuickPromptBar = ({ onRun }: { onRun: (text: string) => void }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
      <Sparkles aria-hidden="true" className="size-3 text-muted-foreground" />
      快捷指令：
    </span>
    {COCKPIT_QUICK_PROMPTS.map((prompt) => (
      <button
        key={prompt}
        type="button"
        onClick={() => onRun(prompt)}
        className="cursor-pointer rounded-full border border-solid border-border/80 bg-card px-2.5 py-1 font-sans text-[11px] font-medium text-foreground transition-colors hover:border-foreground/25 hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-white/10 dark:hover:border-white/25"
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
  <div className="flex flex-col gap-3 rounded-2xl border border-solid border-border/80 bg-secondary/30 p-3.5 dark:border-white/10 dark:bg-secondary/20">
    <QuickPromptBar onRun={onRun} />
    <div className="flex items-center gap-2">
      <input
        aria-label="输入智能体指令"
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && draft.trim() && onRun(draft.trim())}
        placeholder="输入设计需求、语音听写或架构审查指令…"
        className="h-10 min-w-0 flex-1 rounded-full border border-solid border-border/80 bg-background px-4 text-xs text-foreground outline-none transition-[border-color,box-shadow] focus:border-ring focus:ring-1 focus:ring-ring focus:ring-inset dark:border-white/12 dark:bg-card"
      />
      <button
        type="button"
        aria-label="执行指令"
        onClick={() => draft.trim() && onRun(draft.trim())}
        className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-primary bg-primary px-4 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-[opacity,transform] hover:opacity-92 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      >
        <Send aria-hidden="true" className="size-3.5" />
        <span>执行</span>
      </button>
    </div>
    <p className="m-0 font-mono text-[11px] text-muted-foreground tabular-nums">
      最近执行：{lastPrompt}
    </p>
  </div>
);

const VoicePanel = ({
  voiceActive,
  onVoiceChange,
}: {
  voiceActive: boolean;
  onVoiceChange: (next: boolean) => void;
}) => (
  <div className="flex flex-col justify-between gap-3 rounded-2xl border border-solid border-border/80 bg-secondary/25 p-4 dark:border-white/10 dark:bg-secondary/20">
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="m-0 text-xs font-semibold text-foreground">实时语音与流式状态流</p>
        <p className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
          支持随时切入语音听写模式，流体极光球与频谱波形自动联动。
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-solid border-border/80 bg-card px-2 py-0.5 font-mono text-[10px] text-muted-foreground dark:border-white/10">
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full",
            voiceActive ? "bg-emerald-500" : "bg-muted-foreground/45",
          )}
        />
        <span>{voiceActive ? "48kHz · 在线" : "待命"}</span>
      </span>
    </div>
    <AudioWaves
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
        "@container relative flex w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-solid text-card-foreground",
        cfg.compact ? "gap-4 p-4" : "gap-5 p-6",
        COCKPIT_SURFACE_CLASS[cfg.variant],
        cfg.className,
      )}
    >
      {cfg.variant === "studio" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-signal/[0.06] to-transparent dark:from-signal/[0.12]"
        />
      )}
      <div className={cn("relative z-10 flex flex-col", cfg.compact ? "gap-4" : "gap-5")}>
        <CockpitHeader
          title={cfg.title}
          subtitle={cfg.subtitle}
          mode={c.mode}
          tokens={c.tokens}
          onModeChange={c.handleModeChange}
        />
        <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
          <AiReasoning
            status={c.mode === "research" ? "thinking" : "completed"}
            defaultExpanded
            className="max-w-none"
          />
          <VoicePanel voiceActive={c.voiceActive} onVoiceChange={c.setVoiceActive} />
        </div>
        <ComposerBar
          draft={c.draft}
          lastPrompt={c.lastPrompt}
          onDraftChange={c.setDraft}
          onRun={c.runPrompt}
        />
      </div>
    </div>
  );
};
