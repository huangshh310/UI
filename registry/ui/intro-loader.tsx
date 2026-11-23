// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * IntroLoader：品牌/页面首屏磨砂入场遮罩，支持柔焦字标切换、柔光氛围、跳过控制与减弱动效即时跳过。
 */

import { cn } from "@/lib/utils";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export const INTRO_SURFACE_VARIANT: Record<IntroLoaderVariant, string> = {
  default: "bg-card/95 backdrop-blur-2xl dark:bg-card/92",
  minimal: "bg-background/98 backdrop-blur-md dark:bg-background/96",
  spotlight: "bg-card/96 backdrop-blur-2xl dark:bg-card/94",
};

export const INTRO_INLINE_CLASS =
  "min-h-52 w-full rounded-[22px] border border-solid border-border/80 p-7 shadow-[0_14px_40px_-12px_rgba(0,0,0,0.12),0_2px_8px_-2px_rgba(0,0,0,0.04)] dark:border-white/10 dark:shadow-[0_20px_54px_-12px_rgba(0,0,0,0.72)]";

export const INTRO_PROGRESS_FILL: Record<IntroLoaderTone, string> = {
  neutral: "bg-foreground",
  signal: "bg-signal",
};

export const INTRO_SKIP_BUTTON_CLASS =
  "absolute right-4 bottom-4 z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-solid border-border/85 bg-background/90 px-3 py-1 font-mono text-[11px] font-medium text-muted-foreground shadow-xs outline-none transition-[border-color,color,background-color] duration-(--ui-duration-fast) hover:border-foreground/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring dark:border-white/12 dark:bg-white/6 dark:hover:border-white/25";
export type IntroLoaderVariant = "default" | "minimal" | "spotlight";
export type IntroLoaderTone = "neutral" | "signal";

export interface IntroGreeting {
  text: string;
  lang?: string;
}

export interface IntroLoaderProps {
  /** 轮播问候语或品牌词 */
  greetings?: IntroGreeting[];
  /** 总展示时长（毫秒） */
  durationMs?: number;
  /** 是否处于播放激活状态 */
  active: boolean;
  /** 播放完毕或用户跳过时回调 */
  onComplete?: () => void;
  /** 是否覆盖全屏；文档演示可设 false 嵌入容器 */
  fullscreen?: boolean;
  /** 是否允许用户手动跳过或按 Esc 退出 */
  skippable?: boolean;
  /** 视觉风格：default 磨砂幕布 / minimal 极简文字 / spotlight 柔光光晕 */
  variant?: IntroLoaderVariant;
  /** 进度条与强调色调 */
  tone?: IntroLoaderTone;
  /** 底部展示的品牌或版本说明 */
  subtitle?: string;
  /** 跳过按钮文案 */
  skipLabel?: string;
  /** 自定义类名 */
  className?: string;
}
const DEFAULT_GREETINGS: IntroGreeting[] = [
  { text: "你好", lang: "ZH" },
  { text: "Hello", lang: "EN" },
  { text: "Bonjour", lang: "FR" },
  { text: "matt-ui", lang: "UI" },
];

const useIntroTimer = (
  active: boolean,
  durationMs: number,
  count: number,
  onComplete?: () => void,
) => {
  const prefersReduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (prefersReduced) {
      onComplete?.();
      return;
    }
    const intervalMs = Math.max(240, Math.floor(durationMs / Math.max(1, count)));
    const tick = window.setInterval(() => {
      setStep((prev) => (prev + 1 < count ? prev + 1 : prev));
    }, intervalMs);
    const done = window.setTimeout(() => {
      setStep(0);
      onComplete?.();
    }, durationMs);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [active, durationMs, count, onComplete, prefersReduced]);

  return active ? Math.min(step, Math.max(0, count - 1)) : 0;
};

const LoaderProgressBar = ({
  lang,
  progress,
  tone,
}: {
  lang?: string;
  progress: number;
  tone: IntroLoaderTone;
}) => (
  <div className="relative z-10 mt-6 flex items-center gap-3">
    {lang && (
      <span className="rounded-full border border-solid border-border/80 bg-secondary/75 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground dark:border-white/10 dark:bg-white/8">
        {lang}
      </span>
    )}
    <div className="h-1 w-36 overflow-hidden rounded-full bg-secondary/90 dark:bg-white/10">
      <motion.div
        className={cn("h-full rounded-full", INTRO_PROGRESS_FILL[tone])}
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      />
    </div>
  </div>
);

const AnimatedGreeting = ({ text }: { text: string }) => (
  <div className="relative z-10 flex min-h-14 items-center justify-center">
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={text}
        initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
        transition={{ duration: 0.24 }}
        className="font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
      >
        {text}
      </motion.span>
    </AnimatePresence>
  </div>
);

interface LoaderCurtainProps {
  current: IntroGreeting;
  progress: number;
  fullscreen: boolean;
  skippable: boolean;
  variant: IntroLoaderVariant;
  tone: IntroLoaderTone;
  subtitle?: string;
  skipLabel: string;
  onSkip: () => void;
  className?: string;
}

const LoaderCurtain = ({
  current,
  progress,
  fullscreen,
  skippable,
  variant,
  tone,
  subtitle,
  skipLabel,
  onSkip,
  className,
}: LoaderCurtainProps) => (
  <motion.output
    aria-label="页面加载中"
    data-slot="intro-loader"
    data-variant={variant}
    initial={{ opacity: 1 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.28 }}
    className={cn(
      "relative flex flex-col items-center justify-center overflow-hidden",
      INTRO_SURFACE_VARIANT[variant],
      fullscreen ? "fixed inset-0 z-50" : INTRO_INLINE_CLASS,
      className,
    )}
  >
    {variant === "spotlight" && (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-14 size-56 rounded-full bg-signal/16 blur-3xl dark:bg-signal/22"
      />
    )}
    <AnimatedGreeting text={current.text} />
    <LoaderProgressBar lang={current.lang} progress={progress} tone={tone} />
    {subtitle && (
      <p className="relative z-10 m-0 mt-3 font-mono text-[11px] text-muted-foreground">
        {subtitle}
      </p>
    )}
    {skippable && (
      <button type="button" onClick={onSkip} className={INTRO_SKIP_BUTTON_CLASS}>
        {skipLabel}
      </button>
    )}
  </motion.output>
);

const useIntroEscape = (active: boolean, skippable: boolean, onComplete?: () => void) => {
  useEffect(() => {
    if (!active || !skippable) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onComplete?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, skippable, onComplete]);
};

const resolveIntroCore = (props: IntroLoaderProps) => ({
  greetings: props.greetings ?? DEFAULT_GREETINGS,
  durationMs: props.durationMs ?? 2400,
  fullscreen: props.fullscreen ?? true,
  skippable: props.skippable ?? true,
});

const resolveIntroVisual = (props: IntroLoaderProps) => ({
  variant: props.variant ?? "default",
  tone: props.tone ?? "neutral",
  skipLabel: props.skipLabel ?? "跳过 · ESC",
});

export const IntroLoader = (props: IntroLoaderProps) => {
  const core = resolveIntroCore(props);
  const visual = resolveIntroVisual(props);
  const step = useIntroTimer(
    props.active,
    core.durationMs,
    core.greetings.length,
    props.onComplete,
  );
  useIntroEscape(props.active, core.skippable, props.onComplete);

  const current = core.greetings[step] ?? core.greetings[0];
  const progress = Math.round(((step + 1) / Math.max(1, core.greetings.length)) * 100);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {props.active && current && (
          <LoaderCurtain
            current={current}
            progress={progress}
            fullscreen={core.fullscreen}
            skippable={core.skippable}
            variant={visual.variant}
            tone={visual.tone}
            subtitle={props.subtitle}
            skipLabel={visual.skipLabel}
            onSkip={() => props.onComplete?.()}
            className={props.className}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};
