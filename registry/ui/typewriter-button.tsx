// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * TypewriterButton：点击后把文字逐字重新打出来的按钮。
 *
 * 可访问名称始终是完整的 label，逐字变化的部分对辅助技术隐藏，
 * 屏幕阅读器不会把打字过程读成一串零碎的字符。
 * 按钮的宽度由一份不可见的完整文字撑住，打字过程中不会跳动。
 * 用户要求减少动态效果时光标不闪烁。
 */

import { cn } from "@/lib/utils";
import { type ComponentProps, type MouseEvent, useEffect, useRef, useState } from "react";

export interface TypewriterButtonProps extends Omit<ComponentProps<"button">, "children"> {
  /** 按钮上的文字，逐字显示的就是它 */
  label: string;
  /** 每个字符之间的间隔，单位毫秒，默认 75 */
  charDuration?: number;
  /** 挂载后是否立即开始打字，默认否 */
  autoStart?: boolean;
  /** 逐字显示时是否播放机械按键音效，默认是 */
  sound?: boolean;
  /** 全部字符显示完后调用 */
  onComplete?: () => void;
}
interface KeySoundPlayer {
  /** 在用户手势回调中预热并恢复音频上下文，满足浏览器自动播放策略 */
  unlock: () => void;
  /** 触发一次按键音 */
  play: () => void;
  /** 释放音频上下文 */
  close: () => void;
}

const getAudioContextConstructor = (): typeof AudioContext | undefined => {
  if (typeof globalThis === "undefined") return undefined;
  const host = globalThis as typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };
  return host.AudioContext ?? host.webkitAudioContext;
};

/** 合成一次清脆的指数衰减滤波噪声脉冲 */
const playClick = (ctx: AudioContext) => {
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  const duration = 0.016;
  const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i += 1) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleCount * 0.28));
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  // 轻微频偏让连续打字更自然，避免听感僵硬
  filter.frequency.value = 1900 + Math.random() * 650;
  filter.Q.value = 1.6;

  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + duration);
};

const createKeySound = (): KeySoundPlayer => {
  let context: AudioContext | null = null;

  const ensureContext = (): AudioContext | null => {
    if (context) return context;
    const AudioCtx = getAudioContextConstructor();
    if (!AudioCtx) return null;
    try {
      context = new AudioCtx();
    } catch {
      return null;
    }
    return context;
  };

  return {
    unlock: () => {
      const ctx = ensureContext();
      if (ctx && ctx.state === "suspended") void ctx.resume().catch(() => {});
    },
    play: () => {
      const ctx = ensureContext();
      if (!ctx) return;
      try {
        playClick(ctx);
      } catch {
        // 忽略自动播放限制或已关闭的音频上下文
      }
    },
    close: () => {
      if (!context) return;
      const target = context;
      context = null;
      try {
        void target.close().catch(() => {});
      } catch {
        // 忽略关闭异常
      }
    },
  };
};
interface TypewriterOptions {
  label: string;
  charDuration: number;
  autoStart: boolean;
  sound: boolean;
  onComplete?: (() => void) | undefined;
}

/** 管理按键音效播放器的生命周期，卸载或关闭音效时释放音频上下文 */
const useKeySoundPlayer = (enabled: boolean) => {
  const enabledRef = useRef(enabled);
  const playerRef = useRef<ReturnType<typeof createKeySound> | null>(null);

  useEffect(() => {
    enabledRef.current = enabled;
    if (!enabled && playerRef.current) {
      playerRef.current.close();
      playerRef.current = null;
    }
  });

  useEffect(
    () => () => {
      playerRef.current?.close();
      playerRef.current = null;
    },
    [],
  );

  const unlock = () => {
    if (!enabledRef.current) return;
    playerRef.current ??= createKeySound();
    playerRef.current.unlock();
  };

  const playIfVisible = (char: string | undefined) => {
    if (!enabledRef.current || !char || /\s/.test(char)) return;
    playerRef.current ??= createKeySound();
    playerRef.current.play();
  };

  return { unlock, playIfVisible };
};

const useTypewriter = ({
  label,
  charDuration,
  autoStart,
  sound,
  onComplete,
}: TypewriterOptions) => {
  const [visible, setVisible] = useState(autoStart ? 0 : label.length);
  const [run, setRun] = useState(autoStart ? 1 : 0);
  const [typing, setTyping] = useState(autoStart);
  const onCompleteRef = useRef(onComplete);
  const soundPlayer = useKeySoundPlayer(sound);
  const playCharRef = useRef(soundPlayer.playIfVisible);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    playCharRef.current = soundPlayer.playIfVisible;
  });

  useEffect(() => {
    if (run === 0) return undefined;
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      playCharRef.current(label[count - 1]);
      setVisible(count);
      if (count >= label.length) {
        clearInterval(timer);
        setTyping(false);
        onCompleteRef.current?.();
      }
    }, charDuration);
    return () => clearInterval(timer);
  }, [run, label, charDuration]);

  const start = () => {
    soundPlayer.unlock();
    setVisible(0);
    setTyping(true);
    setRun((current) => current + 1);
  };

  return { text: label.slice(0, visible), typing, start };
};
const BUTTON_CLASSES = cn(
  "m-0 box-border inline-flex h-10 cursor-pointer appearance-none items-center justify-center rounded-full border border-solid border-border bg-background px-5 shadow-sm dark:bg-card",
  "font-mono text-sm whitespace-nowrap text-foreground select-none",
  "transition-colors duration-(--ui-duration-fast) hover:border-foreground/22 hover:bg-accent",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:opacity-50",
);

export const TypewriterButton = ({
  label,
  charDuration = 75,
  autoStart = false,
  sound = true,
  onComplete,
  className,
  type = "button",
  onClick,
  ...props
}: TypewriterButtonProps) => {
  const { text, typing, start } = useTypewriter({
    label,
    charDuration,
    autoStart,
    sound,
    onComplete,
  });

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    start();
    onClick?.(event);
  };

  return (
    <button
      type={type}
      aria-label={label}
      data-slot="typewriter-button"
      data-typing={typing ? "" : undefined}
      className={cn(BUTTON_CLASSES, className)}
      onClick={handleClick}
      {...props}
    >
      <span aria-hidden="true" className="relative inline-flex items-center">
        {/* 不可见的完整文字，只用来占住宽度 */}
        <span className="invisible">{label}</span>
        <span className="absolute inset-0 flex items-center">
          <span data-testid="typewriter-text">{text}</span>
          <span
            data-slot="typewriter-caret"
            className="ml-px h-[1.1em] w-px bg-current opacity-0 in-data-typing:animate-pulse in-data-typing:opacity-100 motion-reduce:animate-none"
          />
        </span>
      </span>
    </button>
  );
};
