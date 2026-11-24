"use client";

import { useState } from "react";
import { AlertCircle, Check, ChevronDown, ChevronUp, Copy, Terminal, Wrench } from "lucide-react";
import { cn } from "@matt-ui/utils";
import {
  FrameworkFramesToggle,
  StackCauseFooter,
  StackCodeSnippet,
} from "./ai-stack-trace.snippet.js";
import type {
  AiStackCause,
  AiStackCommand,
  AiStackFrame,
  AiStackTraceProps,
} from "./ai-stack-trace.types.js";
import {
  STACK_DEFAULT_CAUSE,
  STACK_DEFAULT_COMMAND,
  STACK_DEFAULT_FRAMES,
  aiStackTraceContainerVariants,
} from "./ai-stack-trace.variants.js";

function CommandHeader({
  command,
  open,
  onToggle,
}: {
  command: AiStackCommand;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-3 text-xs">
      <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
        <Terminal className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="shrink-0">已执行</span>
        <code className="truncate font-mono text-[11.5px] text-foreground/85">
          {command.command}
        </code>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {typeof command.exitCode === "number" ? (
          <span
            className={cn(
              "font-mono text-[11px] font-medium",
              command.exitCode === 0
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-rose-700 dark:text-rose-300",
            )}
          >
            exit {command.exitCode}
          </span>
        ) : null}
        {command.duration ? (
          <span className="tabular-nums text-[11px] text-muted-foreground">{command.duration}</span>
        ) : null}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={open ? "折叠错误堆栈" : "展开错误堆栈"}
          className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}

function FrameRow({ frame }: { frame: AiStackFrame }) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-baseline gap-x-2 font-mono text-[11.5px] leading-relaxed">
        {frame.fn ? <span className="font-medium text-foreground">{frame.fn}</span> : null}
        <span className="break-all text-muted-foreground">{frame.location}</span>
      </div>
      {frame.snippet ? <StackCodeSnippet snippet={frame.snippet} /> : null}
    </div>
  );
}

function TraceCardHeader(p: {
  errorName: string;
  errorMessage: string;
  copied: boolean;
  onAskFix: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 px-4 py-3">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <AlertCircle className="size-4 shrink-0 text-destructive" aria-hidden="true" />
          <span className="font-medium text-muted-foreground">失败</span>
          <span className="font-mono font-semibold text-foreground">{p.errorName}</span>
        </div>
        <p className="pl-6 text-[13px] font-medium text-foreground">{p.errorMessage}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={p.onAskFix}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Wrench className="size-3.5 text-muted-foreground" aria-hidden="true" />
          请求修复
        </button>
        <button
          type="button"
          onClick={p.onCopy}
          aria-label="复制错误堆栈"
          className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {p.copied ? (
            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

function formatRawTrace(
  name: string,
  message: string,
  frames: AiStackFrame[],
  cause?: AiStackCause | null,
) {
  const causeLine = cause
    ? [`Caused by ${cause.name}${cause.code ? ` ${cause.code}` : ""}: ${cause.message}`]
    : [];
  return [
    `${name}: ${message}`,
    ...frames.map((f) => `  at ${f.fn ? `${f.fn} ` : ""}${f.location}`),
    ...causeLine,
  ].join("\n");
}

const DEFAULT_STACK_CFG = {
  command: STACK_DEFAULT_COMMAND as AiStackCommand | null,
  errorName: "TypeError",
  errorMessage: "fetch failed",
  frames: STACK_DEFAULT_FRAMES,
  frameworkGroupLabel: "next",
  cause: STACK_DEFAULT_CAUSE as AiStackCause | null,
  defaultOpen: true,
  variant: "card" as const,
};

/**
 * AI 错误堆栈与源码上下文排查面板，对标 HextaUI Stack Trace：
 * 支持命令退出码条、一键“请求修复”、高亮出错源码行、框架帧折叠归组与 Caused by 根因链。
 */
export function AiStackTrace(props: AiStackTraceProps) {
  const cfg = { ...DEFAULT_STACK_CFG, ...props };
  const [open, setOpen] = useState(cfg.defaultOpen);
  const [copied, setCopied] = useState(false);

  const appFrames = cfg.frames.filter((f) => !f.framework);
  const fwFrames = cfg.frames.filter((f) => f.framework);
  const fwCount =
    props.frameworkFrameCount ?? (cfg.frames === STACK_DEFAULT_FRAMES ? 8 : fwFrames.length);

  const handleCopyTrace = () => {
    const text = formatRawTrace(cfg.errorName, cfg.errorMessage, cfg.frames, cfg.cause);
    props.onCopy?.(text);
    navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={cn(aiStackTraceContainerVariants({ variant: cfg.variant }), props.className)}>
      {cfg.command ? (
        <CommandHeader command={cfg.command} open={open} onToggle={() => setOpen((v) => !v)} />
      ) : null}
      {open ? (
        <div className="overflow-hidden rounded-xl border border-border/85 bg-card">
          <TraceCardHeader
            errorName={cfg.errorName}
            errorMessage={cfg.errorMessage}
            copied={copied}
            onAskFix={() => props.onAskFix?.({ name: cfg.errorName, message: cfg.errorMessage })}
            onCopy={handleCopyTrace}
          />
          <div className="space-y-2 px-4 py-3">
            {appFrames.map((frame) => (
              <FrameRow key={frame.id} frame={frame} />
            ))}
            <FrameworkFramesToggle
              frames={fwFrames}
              count={fwCount}
              label={cfg.frameworkGroupLabel}
            />
          </div>
          {cfg.cause ? <StackCauseFooter cause={cfg.cause} /> : null}
        </div>
      ) : null}
    </div>
  );
}
