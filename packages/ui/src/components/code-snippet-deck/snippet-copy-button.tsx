"use client";

/**
 * 复制当前代码的按钮。仅供 CodeSnippetDeck 内部使用。
 */
import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** 「已复制」反馈的持续时间 */
const FEEDBACK_MS = 1600;

export const SnippetCopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), FEEDBACK_MS);
  };

  return (
    <button
      type="button"
      aria-label="Copy code"
      onClick={copy}
      className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4" />
      ) : (
        <Copy aria-hidden="true" className="size-4" />
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
};
