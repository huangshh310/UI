// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * DragToConfirm：必须把滑块拖到尽头才会确认的滑轨，用于删除、转账这类关键操作。
 *
 * 拖到九成以上松手即确认，否则滑块弹回起点；拖动过程中提示文字逐渐淡出。
 * 键盘用户可以聚焦滑块后按 Enter 或空格直接确认，这是拖动的替代方式。
 * 确认结果通过播报区告知屏幕阅读器。
 */

import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";
import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

/** 语义色调 */
export type DragToConfirmTone = "signal" | "destructive" | "emerald";

/** 滑轨材质变体 */
export type DragToConfirmVariant = "subtle" | "glass";

/** 滑轨尺寸 */
export type DragToConfirmSize = "sm" | "md" | "lg";

export interface DragToConfirmProps {
  /** 轨道上的提示文字，也是滑块的可访问名称，默认「Slide to confirm」 */
  label?: string;
  /** 确认后显示的文字，默认「Confirmed」 */
  confirmedLabel?: string;
  /** 语义色调，默认 signal */
  tone?: DragToConfirmTone;
  /** 滑轨材质变体，默认 subtle */
  variant?: DragToConfirmVariant;
  /** 滑轨尺寸，默认 md */
  size?: DragToConfirmSize;
  /** 自定义滑块未确认时的图标，默认为右箭头 */
  icon?: ReactNode;
  /** 确认时调用 */
  onConfirm?: () => void;
  /** 自动复位时调用 */
  onReset?: () => void;
  /** 确认后多久自动复位，单位毫秒；0 表示不复位。默认 2500 */
  autoResetDelay?: number;
  /** 跨过确认阈值与确认时是否触发设备震动反馈，默认是 */
  haptics?: boolean;
  disabled?: boolean;
  className?: string;
}
const TRACK_BASE_CLASSES =
  "relative flex max-w-full items-center overflow-hidden rounded-full border border-solid p-1 font-sans font-medium tracking-[-0.01em] select-none transition-colors duration-(--ui-duration-normal)";

const TRACK_VARIANT_CLASSES: Record<DragToConfirmVariant, string> = {
  subtle:
    "border-border bg-secondary/75 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:bg-card dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]",
  glass: "border-border/90 bg-card/90 shadow-sm backdrop-blur-md dark:bg-card/85",
};

const HANDLE_BASE_CLASSES =
  "relative z-10 flex shrink-0 cursor-grab touch-none items-center justify-center rounded-full border-0 outline-none transition-colors duration-(--ui-duration-normal) active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid";

interface DragSizeTokens {
  track: string;
  handle: string;
  handlePx: number;
  hintPad: string;
  confirmedPad: string;
  icon: string;
}

const DRAG_SIZE_CONFIG: Record<DragToConfirmSize, DragSizeTokens> = {
  sm: {
    track: "h-12 w-64 text-xs",
    handle: "size-10",
    handlePx: 40,
    hintPad: "pl-10",
    confirmedPad: "pr-10",
    icon: "size-4",
  },
  md: {
    track: "h-14 w-72 text-sm",
    handle: "size-12",
    handlePx: 48,
    hintPad: "pl-12",
    confirmedPad: "pr-12",
    icon: "size-5",
  },
  lg: {
    track: "h-16 w-80 text-[15px]",
    handle: "size-14",
    handlePx: 56,
    hintPad: "pl-14",
    confirmedPad: "pr-14",
    icon: "size-5",
  },
};

interface DragToneTokens {
  fill: string;
  handleIdle: string;
  handleConfirmed: string;
  confirmedBorder: string;
}

const DRAG_TONE_CONFIG: Record<DragToConfirmTone, DragToneTokens> = {
  signal: {
    fill: "bg-signal/16 dark:bg-signal/22",
    handleIdle:
      "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_2px_8px_rgba(0,0,0,0.16)]",
    handleConfirmed:
      "bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_10px_color-mix(in_oklab,var(--ui-signal)_40%,transparent)]",
    confirmedBorder: "border-signal/45",
  },
  destructive: {
    fill: "bg-destructive/16 dark:bg-destructive/22",
    handleIdle:
      "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(220,38,38,0.28)]",
    handleConfirmed:
      "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_10px_rgba(220,38,38,0.34)]",
    confirmedBorder: "border-destructive/50",
  },
  emerald: {
    fill: "bg-emerald-600/16 dark:bg-emerald-500/22",
    handleIdle:
      "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_2px_8px_rgba(0,0,0,0.16)]",
    handleConfirmed:
      "bg-emerald-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_10px_rgba(4,120,87,0.34)] dark:bg-emerald-500 dark:text-neutral-950",
    confirmedBorder: "border-emerald-600/45 dark:border-emerald-500/50",
  },
};
/** 拖过轨道可用长度的这个比例即视为确认 */
const CONFIRM_RATIO = 0.9;

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

/** 安全调用设备震动；桌面端或不支持的环境静默跳过 */
const triggerVibrate = (pattern: VibratePattern) => {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // 忽略浏览器权限或策略拦截
  }
};

/** 滑块可以移动的最大距离：轨道宽度减去滑块宽度与两侧内边距 */
const measureMaxTravel = (
  track: RefObject<HTMLDivElement | null>,
  handle: RefObject<HTMLButtonElement | null>,
) => (track.current?.clientWidth ?? 0) - (handle.current?.offsetWidth ?? 0) - 8;

/** 拖动过程首次跨过确认阈值时给出轻微震动提示 */
const useThresholdHaptic = (
  x: MotionValue<number>,
  track: RefObject<HTMLDivElement | null>,
  handle: RefObject<HTMLButtonElement | null>,
  enabled: boolean,
  confirmed: boolean,
) => {
  const crossed = useRef(false);
  const stateRef = useRef({ enabled, confirmed });

  useEffect(() => {
    stateRef.current = { enabled, confirmed };
    if (!confirmed) crossed.current = false;
  });

  useEffect(
    () =>
      x.on("change", (latest) => {
        if (stateRef.current.confirmed || !stateRef.current.enabled) return;
        const limit = measureMaxTravel(track, handle);
        if (limit <= 0) return;
        const reached = latest >= limit * CONFIRM_RATIO;
        if (reached && !crossed.current) {
          crossed.current = true;
          triggerVibrate(10);
        } else if (!reached) {
          crossed.current = false;
        }
      }),
    [x, track, handle],
  );
};

interface DragConfirmOptions {
  onConfirm?: (() => void) | undefined;
  onReset?: (() => void) | undefined;
  autoResetDelay?: number | undefined;
  haptics?: boolean | undefined;
}

const useDragConfirm = ({
  onConfirm,
  onReset,
  autoResetDelay = 2500,
  haptics = true,
}: DragConfirmOptions) => {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const [confirmed, setConfirmed] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useThresholdHaptic(x, track, handle, haptics, confirmed);
  useEffect(() => () => clearTimeout(timer.current), []);

  const maxTravel = () => measureMaxTravel(track, handle);
  const moveTo = (target: number) => (reduceMotion ? x.set(target) : animate(x, target, SPRING));

  const reset = () => {
    setConfirmed(false);
    moveTo(0);
    onReset?.();
  };

  const confirm = () => {
    if (confirmed) return;
    setConfirmed(true);
    moveTo(maxTravel());
    if (haptics) triggerVibrate([12, 24, 18]);
    onConfirm?.();
    if (autoResetDelay > 0) timer.current = setTimeout(reset, autoResetDelay);
  };

  const release = () => (x.get() >= maxTravel() * CONFIRM_RATIO ? confirm() : moveTo(0));

  return { x, confirmed, track, handle, confirm, release, maxTravel };
};
const DEFAULTS = {
  label: "Slide to confirm",
  confirmedLabel: "Confirmed",
  tone: "signal",
  variant: "subtle",
  size: "md",
  disabled: false,
} as const;

interface TrackLayersProps {
  x: MotionValue<number>;
  maxTravel: () => number;
  label: string;
  confirmedLabel: string;
  confirmed: boolean;
  sizeTokens: DragSizeTokens;
  toneTokens: DragToneTokens;
}

/** 轨道上的装饰层：随拖动增长的填充、逐渐淡出的提示，以及确认后的文字 */
const TrackLayers = ({
  x,
  maxTravel,
  label,
  confirmedLabel,
  confirmed,
  sizeTokens,
  toneTokens,
}: TrackLayersProps) => {
  const hintOpacity = useTransform(x, (value) => 1 - value / Math.max(maxTravel(), 1));
  const fillWidth = useTransform(x, (value) => value + sizeTokens.handlePx);

  return (
    <>
      <motion.span
        aria-hidden="true"
        style={{ width: fillWidth }}
        className={cn("absolute inset-y-1 left-1 rounded-full", toneTokens.fill)}
      />
      <motion.span
        aria-hidden="true"
        style={{ opacity: hintOpacity }}
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center text-muted-foreground",
          sizeTokens.hintPad,
        )}
      >
        {confirmed ? "" : label}
      </motion.span>
      {confirmed && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 flex items-center justify-center font-medium text-foreground",
            sizeTokens.confirmedPad,
          )}
        >
          {confirmedLabel}
        </span>
      )}
    </>
  );
};

interface HandleProps {
  x: MotionValue<number>;
  handle: RefObject<HTMLButtonElement | null>;
  track: RefObject<HTMLDivElement | null>;
  label: string;
  icon?: ReactNode;
  locked: boolean;
  confirmed: boolean;
  sizeTokens: DragSizeTokens;
  toneTokens: DragToneTokens;
  onRelease: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

/** 可拖动的滑块。locked 为真时不能拖动（禁用或已确认） */
const Handle = ({
  x,
  handle,
  track,
  label,
  icon,
  locked,
  confirmed,
  sizeTokens,
  toneTokens,
  onRelease,
  onKeyDown,
}: HandleProps) => (
  <motion.button
    ref={handle}
    type="button"
    aria-label={`${label}（按 Enter 确认）`}
    aria-disabled={locked || undefined}
    drag={locked ? false : "x"}
    dragConstraints={track}
    dragElastic={0}
    dragMomentum={false}
    onDragEnd={onRelease}
    onKeyDown={onKeyDown}
    style={{ x }}
    data-slot="drag-to-confirm-handle"
    className={cn(
      HANDLE_BASE_CLASSES,
      sizeTokens.handle,
      confirmed ? toneTokens.handleConfirmed : toneTokens.handleIdle,
    )}
  >
    {confirmed ? (
      <Check aria-hidden="true" className={sizeTokens.icon} />
    ) : (
      (icon ?? <ArrowRight aria-hidden="true" className={sizeTokens.icon} />)
    )}
  </motion.button>
);

const createConfirmKeyHandler =
  (disabled: boolean, confirm: () => void) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    confirm();
  };

const buildTrackClasses = (
  p: { variant: DragToConfirmVariant; disabled: boolean; className?: string | undefined },
  sizeTokens: DragSizeTokens,
  toneTokens: DragToneTokens,
  confirmed: boolean,
) =>
  cn(
    TRACK_BASE_CLASSES,
    TRACK_VARIANT_CLASSES[p.variant],
    sizeTokens.track,
    confirmed && toneTokens.confirmedBorder,
    p.disabled && "opacity-45",
    p.className,
  );

export const DragToConfirm = (inputProps: DragToConfirmProps) => {
  const p = { ...DEFAULTS, ...inputProps };
  const { x, confirmed, track, handle, confirm, release, maxTravel } = useDragConfirm(p);
  const sizeTokens = DRAG_SIZE_CONFIG[p.size];
  const toneTokens = DRAG_TONE_CONFIG[p.tone];

  return (
    <div
      ref={track}
      data-slot="drag-to-confirm"
      data-tone={p.tone}
      data-variant={p.variant}
      data-size={p.size}
      data-confirmed={confirmed ? "" : undefined}
      className={buildTrackClasses(p, sizeTokens, toneTokens, confirmed)}
    >
      <TrackLayers
        x={x}
        maxTravel={maxTravel}
        label={p.label}
        confirmedLabel={p.confirmedLabel}
        confirmed={confirmed}
        sizeTokens={sizeTokens}
        toneTokens={toneTokens}
      />
      <Handle
        x={x}
        handle={handle}
        track={track}
        label={p.label}
        icon={p.icon}
        locked={p.disabled || confirmed}
        confirmed={confirmed}
        sizeTokens={sizeTokens}
        toneTokens={toneTokens}
        onRelease={release}
        onKeyDown={createConfirmKeyHandler(p.disabled, confirm)}
      />
      <span aria-live="polite" className="sr-only">
        {confirmed ? p.confirmedLabel : ""}
      </span>
    </div>
  );
};
