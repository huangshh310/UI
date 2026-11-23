"use client";

/**
 * AiToolCall 载荷抽屉与暗色 JSON 复制面板部件。
 */
import { cn } from "@matt-ui/utils";
import { Check, Copy, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AiToolCallStatus } from "./ai-tool-call.types.js";

const PayloadBox = ({ label, json }: { label: string; json: string }) => {
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
    navigator.clipboard?.writeText(json).catch(() => {});
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCopied(false);
    }, 1200);
  };
  return (
    <div className="[color-scheme:dark] flex flex-col overflow-hidden rounded-xl border border-solid border-zinc-800 bg-zinc-950 text-zinc-100">
      <div className="flex items-center justify-between gap-2 border-b border-solid border-zinc-800/90 bg-zinc-900/75 px-3 py-1.5">
        <span className="font-mono text-[10px] font-semibold tracking-wider text-zinc-300 uppercase">
          {label}
        </span>
        <button
          type="button"
          aria-label={copied ? `已复制 ${label}` : `复制 ${label}`}
          onClick={copy}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-1.5 py-0.5 font-sans text-[10px] font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-50 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
          <span>{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      <pre className="m-0 p-3 font-mono text-[11px] leading-relaxed break-all whitespace-pre-wrap text-zinc-200">
        <code>{json}</code>
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
      "flex flex-col gap-3 border-t border-solid p-4",
      obsidian ? "border-zinc-800 bg-zinc-900/50" : "border-border/75 bg-secondary/35",
    )}
  >
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <PayloadBox label="Parameters" json={inputJson} />
      <PayloadBox label="Result" json={outputJson} />
    </div>
    {status === "error" && onRetry && (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "inline-flex h-7.5 cursor-pointer items-center gap-1.5 rounded-full border border-solid px-3 font-sans text-xs font-medium shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
            obsidian
              ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              : "border-border bg-card text-foreground hover:bg-accent",
          )}
        >
          <RotateCcw aria-hidden="true" className="size-3" />
          <span>重试工具调用</span>
        </button>
      </div>
    )}
  </div>
);
