// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * IntroLoader：品牌/页面首屏入场遮罩，支持柔焦字标切换、跳过控制与减弱动效即时跳过。
 */

import { cn } from "@/lib/utils";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

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

const LoaderProgressBar = ({ lang, progress }: { lang?: string; progress: number }) => (
  <div className="mt-6 flex items-center gap-3">
    {lang && (
      <span className="rounded-full border border-solid border-border bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
        {lang}
      </span>
    )}
    <div className="h-0.5 w-36 overflow-hidden rounded-full bg-secondary">
      <motion.div
        className="h-full bg-foreground"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.28 }}
      />
    </div>
  </div>
);

interface LoaderCurtainProps {
  current: IntroGreeting;
  progress: number;
  fullscreen: boolean;
  skippable: boolean;
  onSkip: () => void;
  className?: string;
}

const AnimatedGreeting = ({ text }: { text: string }) => (
  <div className="relative z-10 flex min-h-14 items-center justify-center">
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={text}
        initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
        transition={{ duration: 0.24 }}
        className="font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
      >
        {text}
      </motion.span>
    </AnimatePresence>
  </div>
);

const LoaderCurtain = ({
  current,
  progress,
  fullscreen,
  skippable,
  onSkip,
  className,
}: LoaderCurtainProps) => (
  <motion.output
    aria-label="页面加载中"
    data-slot="intro-loader"
    initial={{ opacity: 1 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.28 }}
    className={cn(
      "relative flex flex-col items-center justify-center overflow-hidden bg-card/95 backdrop-blur-xl",
      fullscreen
        ? "fixed inset-0 z-50"
        : "min-h-52 w-full rounded-[22px] border border-solid border-border p-7 shadow-xs",
      className,
    )}
  >
    <AnimatedGreeting text={current.text} />
    <LoaderProgressBar lang={current.lang} progress={progress} />
    {skippable && (
      <button
        type="button"
        onClick={onSkip}
        className="absolute right-4 bottom-4 cursor-pointer rounded-full border border-solid border-border bg-background px-3 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-secondary/60"
      >
        跳过 · ESC
      </button>
    )}
  </motion.output>
);

export const IntroLoader = ({
  greetings = DEFAULT_GREETINGS,
  durationMs = 2400,
  active,
  onComplete,
  fullscreen = true,
  skippable = true,
  className,
}: IntroLoaderProps) => {
  const step = useIntroTimer(active, durationMs, greetings.length, onComplete);

  useEffect(() => {
    if (!active || !skippable) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onComplete?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, skippable, onComplete]);

  const current = greetings[step] ?? greetings[0];
  const progress = Math.round(((step + 1) / Math.max(1, greetings.length)) * 100);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {active && current && (
          <LoaderCurtain
            current={current}
            progress={progress}
            fullscreen={fullscreen}
            skippable={skippable}
            onSkip={() => onComplete?.()}
            className={className}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};
