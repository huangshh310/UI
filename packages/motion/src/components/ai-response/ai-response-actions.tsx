"use client";

/**
 * AiResponse 底部操作按钮栏：复制回复、重新生成与赞踩反馈按钮。
 */
import { cn } from "@matt-ui/utils";
import { Check, Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { copyTextToClipboard } from "./ai-response-safe.js";
import { AI_RESPONSE_ACTION_BTN } from "./ai-response.variants.js";

const FeedbackButtons = ({
  vote,
  onVote,
}: {
  vote: "up" | "down" | null;
  onVote: (next: "up" | "down") => void;
}) => (
  <>
    <button
      type="button"
      onClick={() => onVote("up")}
      aria-label="有帮助"
      aria-pressed={vote === "up"}
      className={cn(
        AI_RESPONSE_ACTION_BTN,
        vote === "up" &&
          "border-border/70 bg-secondary text-foreground dark:border-white/10 dark:bg-white/12",
      )}
    >
      <ThumbsUp className="size-3.5" />
    </button>
    <button
      type="button"
      onClick={() => onVote("down")}
      aria-label="需改进"
      aria-pressed={vote === "down"}
      className={cn(
        AI_RESPONSE_ACTION_BTN,
        vote === "down" &&
          "border-border/70 bg-secondary text-foreground dark:border-white/10 dark:bg-white/12",
      )}
    >
      <ThumbsDown className="size-3.5" />
    </button>
  </>
);

export const ResponseActionBar = ({
  content,
  onRegenerate,
  onFeedback,
  onCopy,
  className,
}: {
  content: string;
  onRegenerate?: () => void;
  onFeedback?: (type: "up" | "down") => void;
  onCopy?: (content: string) => void;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(content);
    if (!ok) return;
    setCopied(true);
    onCopy?.(content);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const handleVote = (next: "up" | "down") => {
    setVote(next);
    onFeedback?.(next);
  };

  return (
    <div className={cn("mt-3 flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="复制回复内容"
        className={AI_RESPONSE_ACTION_BTN}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          aria-label="重新生成"
          className={AI_RESPONSE_ACTION_BTN}
        >
          <RotateCcw className="size-3.5" />
        </button>
      )}
      {onFeedback && <FeedbackButtons vote={vote} onVote={handleVote} />}
    </div>
  );
};
