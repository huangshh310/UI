"use client";

/**
 * 复制当前代码的按钮。仅供 CodeSnippetDeck 内部使用。
 */
import { cn } from "@matt-ui/utils";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CodeSnippetDeckVariant } from "./code-snippet-deck.types.js";

/** 「已复制」反馈的持续时间 */
const FEEDBACK_MS = 1600;

const copyButtonClass = (isTerminal: boolean, copied: boolean) =>
  cn(
    "inline-flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-(--ui-duration-fast) outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid",
    isTerminal
      ? "bg-white/8 text-[#d4d4d8] hover:bg-white/14 hover:text-[#fafafa]"
      : "bg-card text-muted-foreground shadow-2xs hover:bg-accent hover:text-foreground",
    copied && (isTerminal ? "text-emerald-400" : "text-emerald-700 dark:text-emerald-400"),
  );

export const SnippetCopyButton = ({
  text,
  variant,
  onCopied,
}: {
  text: string;
  variant: CodeSnippetDeckVariant;
  onCopied?: () => void;
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    onCopied?.();
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCopied(false);
    }, FEEDBACK_MS);
  };

  return (
    <button
      type="button"
      aria-label="Copy code"
      onClick={copy}
      className={copyButtonClass(variant === "terminal", copied)}
    >
      {copied ? (
        <Check aria-hidden="true" className="size-3.5" />
      ) : (
        <Copy aria-hidden="true" className="size-3.5" />
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
};
