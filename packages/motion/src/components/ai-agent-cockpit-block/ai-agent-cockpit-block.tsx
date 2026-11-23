"use client";

/**
 * AiAgentCockpitBlock：由 AiOrb、AudioWaves、AiReasoning、SegmentedControl 与 NumberFlow 组合的 C 端多模态智能体驾驶舱区块。
 */
import { cn } from "@matt-ui/utils";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { AiOrb } from "../ai-orb/index.js";
import { AiReasoning } from "../ai-reasoning/index.js";
import { AudioWaves } from "../audio-waves/index.js";
import { NumberFlow } from "../number-flow/index.js";
import { SegmentedControl } from "../segmented-control/index.js";
import type { AiAgentCockpitBlockProps, AiCockpitMode } from "./ai-agent-cockpit-block.types.js";

const MODES = [
  { value: "chat", label: "智能对话" },
  { value: "voice", label: "实时语音", badge: "Live" },
  { value: "research", label: "深度研究" },
];

const QUICK_PROMPTS = ["优化 C 端触感光影", "生成 AI 组件对比度报告", "同步 89 项 Registry 清单"];

const CockpitHeader = ({
  mode,
  tokens,
  onModeChange,
}: {
  mode: AiCockpitMode;
  tokens: number;
  onModeChange: (next: AiCockpitMode) => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-solid border-border/80 pb-4">
    <div className="flex items-center gap-3">
      <AiOrb
        state={mode === "voice" ? "listening" : mode === "research" ? "thinking" : "speaking"}
        variant={mode === "research" ? "lattice" : "aurora"}
        size="md"
      />
      <div>
        <p className="m-0 text-base font-semibold tracking-tight text-foreground">
          多模态智能体驾驶舱
        </p>
        <p className="m-0 text-xs text-muted-foreground">
          融合实时语音波形、思维链推理轨迹与物理分段控制器的 C 端工作台。
        </p>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 rounded-full border border-solid border-border bg-secondary/50 px-3 py-1 text-xs">
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
        items={MODES}
        value={mode}
        onValueChange={(v) => onModeChange(v as AiCockpitMode)}
      />
    </div>
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
  <div className="flex flex-col gap-3 rounded-2xl border border-solid border-border bg-secondary/35 p-3.5">
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
        <Sparkles aria-hidden="true" className="size-3 text-muted-foreground" />
        快捷指令：
      </span>
      {QUICK_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onRun(prompt)}
          className="cursor-pointer rounded-full border border-solid border-border bg-background px-2.5 py-1 font-sans text-[11px] font-medium text-foreground transition-colors hover:border-foreground/25 hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-card"
        >
          {prompt}
        </button>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <input
        aria-label="输入智能体指令"
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && draft.trim() && onRun(draft.trim())}
        placeholder="输入设计需求、语音听写或架构审查指令…"
        className="h-10 min-w-0 flex-1 rounded-full border border-solid border-border bg-background px-4 text-xs text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 dark:bg-card"
      />
      <button
        type="button"
        aria-label="执行指令"
        onClick={() => draft.trim() && onRun(draft.trim())}
        className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-primary bg-primary px-4 font-sans text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      >
        <Send aria-hidden="true" className="size-3.5" />
        <span>执行</span>
      </button>
    </div>
    <p className="m-0 font-mono text-[11px] text-muted-foreground">最近执行：{lastPrompt}</p>
  </div>
);

const VoicePanel = ({
  voiceActive,
  onVoiceChange,
}: {
  voiceActive: boolean;
  onVoiceChange: (next: boolean) => void;
}) => (
  <div className="flex flex-col justify-between gap-3 rounded-2xl border border-solid border-border/85 bg-secondary/30 p-4">
    <div>
      <p className="m-0 text-xs font-semibold text-foreground">实时语音与流式状态流</p>
      <p className="m-0 mt-1 text-xs text-muted-foreground">
        支持随时切入语音听写模式，流体极光球与频谱波形自动联动。
      </p>
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
  onRunPrompt?: (prompt: string, mode: AiCockpitMode) => void,
) => {
  const [mode, setMode] = useState<AiCockpitMode>(defaultMode);
  const [voiceActive, setVoiceActive] = useState(defaultMode === "voice");
  const [tokens, setTokens] = useState(1420);
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

export const AiAgentCockpitBlock = ({
  defaultMode = "chat",
  onRunPrompt,
  className,
}: AiAgentCockpitBlockProps) => {
  const c = useCockpitState(defaultMode, onRunPrompt);
  return (
    <div
      data-slot="ai-agent-cockpit-block"
      className={cn(
        "@container relative flex w-full max-w-4xl flex-col gap-5 overflow-hidden rounded-[24px] border border-solid border-border bg-card p-6 text-card-foreground shadow-xs",
        className,
      )}
    >
      <div className="relative z-10 flex flex-col gap-5">
        <CockpitHeader mode={c.mode} tokens={c.tokens} onModeChange={c.handleModeChange} />
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
