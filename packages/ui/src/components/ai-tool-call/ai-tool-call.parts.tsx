"use client";

/**
 * AiToolCall 载荷抽屉与 JSON 复制面板部件。
 */
import { cn } from "@matt-ui/utils";
import { Check, Copy, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AiToolCallStatus } from "./ai-tool-call.types.js";

const DRAWER_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const useCopyText = (text: string) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const copy = () => {
    setCopied(true);
    navigator.clipboard?.writeText(text).catch(() => {});
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCopied(false);
    }, 1200);
  };

  return { copied, copy };
};

interface PayloadSectionProps {
  label: string;
  json: string;
  obsidian: boolean;
}

const PayloadSection = ({ label, json, obsidian }: PayloadSectionProps) => {
  const { copied, copy } = useCopyText(json);
  const btnCls = obsidian
    ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
    : "text-muted-foreground hover:bg-accent hover:text-foreground";
  const preCls = obsidian
    ? "bg-zinc-900/80 text-zinc-200"
    : "bg-muted/50 text-foreground dark:bg-white/[0.04]";
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "font-mono text-[11px] font-medium tracking-wide",
            obsidian ? "text-zinc-400" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
        <button
          type="button"
          aria-label={copied ? `已复制 ${label}` : `复制 ${label}`}
          onClick={copy}
          className={cn(
            "inline-flex h-6 cursor-pointer items-center gap-1 rounded-md border border-solid border-transparent bg-transparent px-1.5 font-sans text-[11px] font-medium transition-colors",
            DRAWER_FOCUS_RING,
            btnCls,
          )}
        >
          {copied ? (
            <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="size-3" />
          )}
          <span>{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      <pre
        className={cn(
          "m-0 overflow-x-auto rounded-lg px-3 py-2.5 font-mono text-[11.5px] leading-relaxed",
          preCls,
        )}
      >
        <code className="whitespace-pre-wrap break-words">{json}</code>
      </pre>
    </div>
  );
};

export interface PayloadDrawerProps {
  inputJson: string;
  outputJson: string;
  status: AiToolCallStatus;
  obsidian: boolean;
  onRetry?: () => void;
}

export const PayloadDrawer = ({
  inputJson,
  outputJson,
  status,
  obsidian,
  onRetry,
}: PayloadDrawerProps) => (
  <div
    className={cn(
      "flex flex-col gap-3 border-t border-solid px-4 py-3.5",
      obsidian ? "border-zinc-800" : "border-border/75 dark:border-white/8",
    )}
  >
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <PayloadSection label="Parameters" json={inputJson} obsidian={obsidian} />
      <PayloadSection label="Result" json={outputJson} obsidian={obsidian} />
    </div>
    {status === "error" && onRetry && (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg border border-solid px-2.5 font-sans text-xs font-medium transition-colors",
            DRAWER_FOCUS_RING,
            obsidian
              ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              : "border-border bg-card text-foreground hover:bg-accent dark:border-white/10",
          )}
        >
          <RotateCcw aria-hidden="true" className="size-3" />
          <span>重试工具调用</span>
        </button>
      </div>
    )}
  </div>
);
