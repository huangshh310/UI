"use client";

/**
 * AiImageReveal 的浮层与动效部件（对标 AICSS Image Processing 极简单色语言）：
 * 纯净单色等待底板、渐进光学扫光前沿、等宽尺寸微标、流光扫字状态标题与成图操作条。
 */
import { cn } from "@matt-ui/utils";
import { RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import type { AiImageRevealPhase, AiImageRevealVariant } from "./ai-image-reveal.types.js";
import {
  REVEAL_EASE_OUT,
  REVEAL_FOCUS_RING,
  REVEAL_MEDIA_CHIP,
  REVEAL_WAIT_CHIP,
} from "./ai-image-reveal.variants.js";

/** 纯净单色点阵承载底板（彻底去除廉价彩色光晕） */
export const RevealAuroraBackdrop = ({
  visible,
  reduce,
}: {
  visible: boolean;
  reduce: boolean;
}) => (
  <AnimatePresence initial={false}>
    {visible && (
      <motion.div
        key="reveal-surface"
        data-slot="ai-image-reveal-aurora"
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.45, ease: REVEAL_EASE_OUT } }}
        className="pointer-events-none absolute inset-0 bg-neutral-50 dark:bg-[#161618]"
      >
        {reduce && (
          <div className="absolute inset-0 animate-pulse bg-foreground/[0.03] dark:bg-white/[0.03]" />
        )}
      </motion.div>
    )}
  </AnimatePresence>
);

/** 纯净光学白光显影前沿 */
export const RevealScanCurtain = ({
  phase,
  reduce,
  refineSec,
}: {
  phase: AiImageRevealPhase;
  reduce: boolean;
  refineSec: number;
}) => {
  if (reduce) return null;
  return (
    <AnimatePresence>
      {phase === "refine" && (
        <motion.div
          key="reveal-curtain"
          aria-hidden="true"
          initial={{ y: "-12%", opacity: 0 }}
          animate={{ y: "108%", opacity: [0, 0.85, 0.75, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: Math.max(0.5, refineSec * 0.96), ease: REVEAL_EASE_OUT }}
          className="pointer-events-none absolute inset-x-0 top-0 h-12"
        >
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 6%, rgba(255,255,255,0.8) 50%, transparent 94%)",
              boxShadow: "0 0 12px 1px rgba(255,255,255,0.35)",
            }}
          />
          <div
            className="h-10 w-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 55%, transparent 100%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/** 对标 AICSS / BeautifulUI 的流光扫字状态文案 */
export const RevealShimmerHeading = ({ label, reduce }: { label: string; reduce: boolean }) => (
  <span className="relative inline-block text-sm font-medium tracking-tight text-foreground">
    {reduce ? (
      <span>{label}</span>
    ) : (
      <motion.span
        className="inline-block bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(110deg, var(--ui-muted-foreground) 32%, var(--ui-foreground) 50%, var(--ui-muted-foreground) 68%)",
          backgroundSize: "240% 100%",
        }}
        animate={{ backgroundPosition: ["120% 0%", "-120% 0%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      >
        {label}
      </motion.span>
    )}
  </span>
);

const RevealErrorOverlay = ({ onRetry }: { onRetry: () => void }) => (
  <div
    role="alert"
    className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/90 px-6 text-center backdrop-blur-md dark:bg-[#161618]/92"
  >
    <p className="m-0 text-xs font-medium text-muted-foreground">图像加载失败，请重试</p>
    <button
      type="button"
      onClick={onRetry}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-border bg-foreground px-4 font-sans text-xs font-medium text-background transition-opacity hover:opacity-90",
        REVEAL_FOCUS_RING,
      )}
    >
      <RotateCcw aria-hidden="true" className="size-3.5" />
      <span>重新生成</span>
    </button>
  </div>
);

const RevealDoneControls = ({
  showReplayButton,
  actions,
  onRetry,
}: {
  showReplayButton: boolean;
  actions?: ReactNode;
  onRetry: () => void;
}) => (
  <>
    {showReplayButton && (
      <button
        type="button"
        aria-label="重播显影动画"
        onClick={onRetry}
        className={cn(
          "absolute top-2.5 right-2.5 inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-2.5 font-sans text-[11px] font-medium transition-all hover:bg-neutral-950/90 active:scale-[0.98]",
          REVEAL_MEDIA_CHIP,
          REVEAL_FOCUS_RING,
        )}
      >
        <RotateCcw aria-hidden="true" className="size-3" />
        <span>重播</span>
      </button>
    )}
    {actions && (
      <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">{actions}</div>
    )}
  </>
);

export interface RevealOverlaysProps {
  phase: AiImageRevealPhase;
  reduce: boolean;
  badge?: string;
  showReplayButton: boolean;
  actions?: ReactNode;
  onRetry: () => void;
}

export const RevealOverlays = (p: RevealOverlaysProps) => {
  const pending = p.phase === "idle" || p.phase === "gather";
  return (
    <>
      {p.badge && (
        <span
          className={cn(
            "pointer-events-none absolute top-2.5 inline-flex h-6 items-center rounded-md px-2 font-mono text-[10.5px] font-medium tracking-tight tabular-nums",
            pending ? "right-2.5" : "left-2.5 rounded-full px-2.5",
            pending ? REVEAL_WAIT_CHIP : REVEAL_MEDIA_CHIP,
          )}
        >
          {p.badge}
        </span>
      )}
      {p.phase === "done" && (
        <RevealDoneControls
          showReplayButton={p.showReplayButton}
          actions={p.actions}
          onRetry={p.onRetry}
        />
      )}
      {p.phase === "error" && <RevealErrorOverlay onRetry={p.onRetry} />}
    </>
  );
};

export const RevealCaption = ({
  prompt,
  variant,
  phase,
  alt,
  generatingLabel,
  reduce,
}: {
  prompt?: string;
  variant: AiImageRevealVariant;
  phase: AiImageRevealPhase;
  alt: string;
  generatingLabel: string;
  reduce: boolean;
}) => {
  const pending = phase === "idle" || phase === "gather";
  return (
    <>
      {(pending || Boolean(prompt)) && (
        <figcaption
          className={cn(
            "flex flex-col gap-0.5",
            variant === "default" ? "mt-3 px-0.5" : "mt-2.5 px-1.5 pb-1",
          )}
        >
          {pending && <RevealShimmerHeading label={generatingLabel} reduce={reduce} />}
          {prompt && (
            <span
              className={cn(
                "text-xs leading-relaxed text-muted-foreground",
                pending && "before:content-['“'] after:content-['”']",
              )}
            >
              {prompt}
            </span>
          )}
        </figcaption>
      )}
      <output className="sr-only" aria-live="polite">
        {phase === "done" ? `图像已生成：${alt}` : generatingLabel}
      </output>
    </>
  );
};
