"use client";

import { cn } from "@matt-ui/utils";
import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Copy, FileCode2 } from "lucide-react";
import type { AiStackCause, AiStackCodeSnippet, AiStackFrame } from "./ai-stack-trace.types.js";

function SnippetCodeLine({ line }: { line: AiStackCodeSnippet["lines"][number] }) {
  return (
    <div
      className={cn(
        "flex items-start px-3 py-0.5",
        line.highlight ? "bg-rose-500/12 text-foreground" : "text-foreground",
      )}
    >
      <span
        className={cn(
          "mr-4 w-6 shrink-0 select-none text-right tabular-nums",
          line.highlight
            ? "font-semibold text-rose-800 dark:text-rose-300"
            : "text-muted-foreground",
        )}
      >
        {line.lineNumber}
      </span>
      <span className="min-w-0 whitespace-pre-wrap break-all">{line.content || " "}</span>
    </div>
  );
}

export function StackCodeSnippet({ snippet }: { snippet: AiStackCodeSnippet }) {
  const [copied, setCopied] = useState(false);
  const handleCopySnippet = () => {
    const code = snippet.lines.map((l) => l.content).join("\n");
    navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-border/80 bg-background">
      <div className="flex items-center justify-between gap-2 border-b border-border/70 px-3 py-1.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <FileCode2 className="size-3.5 shrink-0" aria-hidden="true" />
          {snippet.file}
        </span>
        <button
          type="button"
          onClick={handleCopySnippet}
          aria-label={`复制 ${snippet.file} 代码片段`}
          className="inline-flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-700 dark:text-emerald-300" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
      <div className="py-1.5 font-mono text-[11.5px] leading-5">
        {snippet.lines.map((line) => (
          <SnippetCodeLine key={line.lineNumber} line={line} />
        ))}
      </div>
    </div>
  );
}

export function FrameworkFramesToggle({
  frames,
  count,
  label,
}: {
  frames: AiStackFrame[];
  count: number;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  if (frames.length === 0) return null;

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-md py-0.5 font-mono text-[11.5px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        <span>{count} 个框架帧</span>
        <span>{label}</span>
      </button>

      {open ? (
        <div className="mt-1.5 ml-2 space-y-1 border-l border-border/70 pl-3 font-mono text-[11px] text-muted-foreground">
          {frames.map((frame) => (
            <div key={frame.id} className="truncate">
              {frame.fn ? <span className="mr-2 text-foreground">{frame.fn}</span> : null}
              <span>{frame.location}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function StackCauseFooter({ cause }: { cause: AiStackCause }) {
  return (
    <div className="border-t border-border/70 bg-muted/35 px-4 py-3 font-mono text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground">Caused by</span>
        <span className="font-semibold text-foreground">{cause.name}</span>
        {cause.code ? (
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground">
            {cause.code}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-muted-foreground">{cause.message}</p>
    </div>
  );
}
