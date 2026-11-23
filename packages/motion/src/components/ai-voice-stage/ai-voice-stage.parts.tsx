"use client";

/**
 * AiVoiceStage 内部展示与控制子部件：顶栏、居中实时字幕流、悬浮通话控制岛与结束重连卡。
 */
import { cn } from "@matt-ui/utils";
import { Captions, Mic, MicOff, PhoneOff, RotateCcw, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { AiOrbState } from "../ai-orb/index.js";
import {
  VOICE_DOCK_BTN,
  VOICE_FOCUS_RING,
  VOICE_LIVE_DOT,
  VOICE_STAGE_SURFACE,
} from "./ai-voice-stage.variants.js";

interface CircleActionProps {
  label: string;
  pressed?: boolean;
  toneClass: string;
  onClick: () => void;
  children: ReactNode;
}

const CircleAction = ({ label, pressed, toneClass, onClick, children }: CircleActionProps) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={pressed}
    onClick={onClick}
    className={cn(VOICE_DOCK_BTN, toneClass)}
  >
    {children}
  </button>
);

const dockTones = (obsidian: boolean) => ({
  wrap: obsidian
    ? "border-white/12 bg-white/[0.06] shadow-[0_12px_28px_-12px_rgba(0,0,0,0.75)]"
    : "border-border/85 bg-background/85 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] dark:border-white/12 dark:bg-neutral-900/80",
  neutral: obsidian
    ? "border-white/12 bg-white/[0.06] text-neutral-100 hover:bg-white/[0.14]"
    : "border-border/85 bg-card text-foreground shadow-2xs hover:bg-accent/70 dark:border-white/12 dark:bg-white/[0.06] dark:hover:bg-white/[0.12]",
  muted: obsidian
    ? "border-white/30 bg-neutral-100 text-neutral-950 hover:bg-white"
    : "border-primary bg-primary text-primary-foreground hover:opacity-92",
  captionOff: obsidian
    ? "border-white/8 bg-transparent text-neutral-400 hover:bg-white/[0.08] hover:text-neutral-100"
    : "border-border/60 bg-transparent text-muted-foreground hover:bg-card hover:text-foreground dark:border-white/10",
  end: obsidian
    ? "border-red-400/25 bg-red-500/18 text-red-400 hover:border-red-500 hover:bg-red-500 hover:text-white"
    : "border-red-500/25 bg-red-500/12 text-red-700 hover:border-red-600 hover:bg-red-600 hover:text-white dark:border-red-400/25 dark:bg-red-500/18 dark:text-red-400 dark:hover:border-red-500 dark:hover:bg-red-500 dark:hover:text-white",
});

export interface VoiceControlsProps {
  muted: boolean;
  showCaption: boolean;
  obsidian: boolean;
  onToggleMute: () => void;
  onCycleState: () => void;
  onToggleCaption: () => void;
  onEnd: () => void;
}

export const VoiceControls = (p: VoiceControlsProps) => {
  const t = dockTones(p.obsidian);
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-solid p-1.5 backdrop-blur-md",
        t.wrap,
      )}
    >
      <CircleAction
        label={p.muted ? "取消静音" : "静音麦克风"}
        pressed={p.muted}
        toneClass={p.muted ? t.muted : t.neutral}
        onClick={p.onToggleMute}
      >
        {p.muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
      </CircleAction>
      <CircleAction label="切换语音状态" toneClass={t.neutral} onClick={p.onCycleState}>
        <Sparkles className="size-4" />
      </CircleAction>
      <CircleAction
        label={p.showCaption ? "隐藏实时字幕" : "显示实时字幕"}
        pressed={p.showCaption}
        toneClass={p.showCaption ? t.neutral : t.captionOff}
        onClick={p.onToggleCaption}
      >
        <Captions className="size-4" />
      </CircleAction>
      <CircleAction label="结束语音会话" toneClass={t.end} onClick={p.onEnd}>
        <PhoneOff className="size-4" />
      </CircleAction>
    </div>
  );
};

export interface StageHeaderProps {
  assistantName: string;
  modelLabel?: string;
  durationLabel?: string;
  state: AiOrbState;
  obsidian: boolean;
}

export const StageHeader = ({
  assistantName,
  modelLabel,
  durationLabel,
  state,
  obsidian,
}: StageHeaderProps) => {
  const paused = state === "idle";
  const sub = obsidian ? "text-neutral-300" : "text-muted-foreground";
  return (
    <div className="relative flex w-full items-center justify-between gap-3 text-xs">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "truncate text-[13px] font-semibold tracking-tight",
            obsidian ? "text-neutral-100" : "text-foreground",
          )}
        >
          {assistantName}
        </span>
        {modelLabel && (
          <span
            className={cn(
              "truncate rounded-full border border-solid px-2 py-0.5 font-mono text-[10px]",
              obsidian
                ? "border-white/10 bg-white/[0.05] text-neutral-300"
                : "border-border/75 bg-muted/55 text-muted-foreground dark:border-white/10 dark:bg-white/[0.04]",
            )}
          >
            {modelLabel}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <span
          className={cn("inline-flex items-center gap-1.5 font-mono text-[11px] font-medium", sub)}
        >
          <span aria-hidden="true" className={cn("size-1.5 rounded-full", VOICE_LIVE_DOT[state])} />
          <span>{paused ? "PAUSED" : "LIVE"}</span>
        </span>
        {durationLabel && (
          <span className={cn("font-mono text-[11px] tabular-nums", sub)}>{durationLabel}</span>
        )}
      </div>
    </div>
  );
};

export const EndedCard = ({
  obsidian,
  onReconnect,
  className,
}: {
  obsidian: boolean;
  onReconnect: () => void;
  className?: string;
}) => (
  <div
    data-slot="ai-voice-stage"
    data-state="ended"
    className={cn(
      "flex w-full max-w-xl flex-col items-center justify-center gap-3 border border-solid px-8 py-12 text-center",
      obsidian ? VOICE_STAGE_SURFACE.obsidian : VOICE_STAGE_SURFACE.card,
      className,
    )}
  >
    <p
      className={cn(
        "m-0 text-sm font-semibold tracking-tight",
        obsidian ? "text-neutral-100" : "text-foreground",
      )}
    >
      语音会话已结束
    </p>
    <p
      className={cn(
        "m-0 text-xs leading-relaxed",
        obsidian ? "text-neutral-300" : "text-muted-foreground",
      )}
    >
      本次通话记录已自动保存，随时可继续对话。
    </p>
    <button
      type="button"
      onClick={onReconnect}
      className={cn(
        "mt-1.5 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-transparent px-4 font-sans text-xs font-medium transition-opacity hover:opacity-90",
        obsidian ? "bg-neutral-100 text-neutral-950" : "bg-primary text-primary-foreground",
        VOICE_FOCUS_RING,
      )}
    >
      <RotateCcw aria-hidden="true" className="size-3.5" />
      <span>重新连线</span>
    </button>
  </div>
);

export const StageCaption = ({
  caption,
  speaker,
  obsidian,
}: {
  caption: string;
  speaker: "assistant" | "user";
  obsidian: boolean;
}) => (
  <div
    className={cn(
      "relative flex w-full max-w-md flex-col items-center gap-2 border-t border-solid px-2 pt-4 pb-1 text-center",
      obsidian ? "border-white/10" : "border-border/65 dark:border-white/10",
    )}
  >
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-solid px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide",
        obsidian
          ? "border-white/12 bg-white/[0.08] text-neutral-100"
          : "border-border/80 bg-muted/75 text-foreground dark:border-white/12 dark:bg-white/[0.06]",
      )}
    >
      {speaker === "user" ? "你" : "AI"}
    </span>
    <p
      className={cn(
        "m-0 text-sm leading-relaxed font-normal",
        obsidian ? "text-neutral-200" : "text-foreground/90",
      )}
    >
      {caption}
    </p>
  </div>
);
