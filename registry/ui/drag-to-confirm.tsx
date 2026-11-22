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
import { type KeyboardEvent, type RefObject, useEffect, useRef, useState } from "react";

export interface DragToConfirmProps {
  /** 轨道上的提示文字，也是滑块的可访问名称，默认「Slide to confirm」 */
  label?: string;
  /** 确认后显示的文字，默认「Confirmed」 */
  confirmedLabel?: string;
  /** 确认时调用 */
  onConfirm?: () => void;
  /** 自动复位时调用 */
  onReset?: () => void;
  /** 确认后多久自动复位，单位毫秒；0 表示不复位。默认 2500 */
  autoResetDelay?: number;
  disabled?: boolean;
  className?: string;
}
/** 拖过轨道可用长度的这个比例即视为确认 */
const CONFIRM_RATIO = 0.9;

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

interface DragConfirmOptions {
  onConfirm?: (() => void) | undefined;
  onReset?: (() => void) | undefined;
  autoResetDelay: number;
}

const useDragConfirm = ({ onConfirm, onReset, autoResetDelay }: DragConfirmOptions) => {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const [confirmed, setConfirmed] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 卸载时取消尚未触发的复位
  useEffect(() => () => clearTimeout(timer.current), []);

  /** 滑块可以移动的最大距离：轨道宽度减去滑块宽度与两侧内边距 */
  const maxTravel = () =>
    (track.current?.clientWidth ?? 0) - (handle.current?.offsetWidth ?? 0) - 8;

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
    onConfirm?.();
    if (autoResetDelay > 0) timer.current = setTimeout(reset, autoResetDelay);
  };

  /** 松手：拖得足够远则确认，否则弹回起点 */
  const release = () => (x.get() >= maxTravel() * CONFIRM_RATIO ? confirm() : moveTo(0));

  return { x, confirmed, track, handle, confirm, release, maxTravel };
};
const TRACK_CLASSES =
  "relative flex h-14 w-72 max-w-full items-center overflow-hidden rounded-full border border-solid border-border bg-background p-1 font-sans text-sm select-none";

const HANDLE_CLASSES =
  "relative z-10 flex size-12 shrink-0 cursor-grab touch-none items-center justify-center rounded-full border-0 bg-primary text-primary-foreground shadow-md outline-none active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid";

interface TrackLayersProps {
  x: MotionValue<number>;
  maxTravel: () => number;
  label: string;
  confirmedLabel: string;
  confirmed: boolean;
}

/** 轨道上的装饰层：随拖动增长的填充、逐渐淡出的提示，以及确认后的文字 */
const TrackLayers = ({ x, maxTravel, label, confirmedLabel, confirmed }: TrackLayersProps) => {
  const hintOpacity = useTransform(x, (value) => 1 - value / Math.max(maxTravel(), 1));
  const fillWidth = useTransform(x, (value) => value + 48);

  return (
    <>
      <motion.span
        aria-hidden="true"
        style={{ width: fillWidth }}
        className="absolute inset-y-1 left-1 rounded-full bg-signal/35"
      />
      <motion.span
        aria-hidden="true"
        style={{ opacity: hintOpacity }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center pl-10 text-muted-foreground"
      >
        {confirmed ? "" : label}
      </motion.span>
      {confirmed && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pr-10 font-medium"
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
  locked: boolean;
  confirmed: boolean;
  onRelease: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

/** 可拖动的滑块。locked 为真时不能拖动（禁用或已确认） */
const Handle = ({
  x,
  handle,
  track,
  label,
  locked,
  confirmed,
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
    className={HANDLE_CLASSES}
  >
    {confirmed ? (
      <Check aria-hidden="true" className="size-5" />
    ) : (
      <ArrowRight aria-hidden="true" className="size-5" />
    )}
  </motion.button>
);

export const DragToConfirm = ({
  label = "Slide to confirm",
  confirmedLabel = "Confirmed",
  onConfirm,
  onReset,
  autoResetDelay = 2500,
  disabled = false,
  className,
}: DragToConfirmProps) => {
  const { x, confirmed, track, handle, confirm, release, maxTravel } = useDragConfirm({
    onConfirm,
    onReset,
    autoResetDelay,
  });

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    confirm();
  };

  return (
    <div
      ref={track}
      data-slot="drag-to-confirm"
      data-confirmed={confirmed ? "" : undefined}
      className={cn(TRACK_CLASSES, disabled && "opacity-50", className)}
    >
      <TrackLayers
        x={x}
        maxTravel={maxTravel}
        label={label}
        confirmedLabel={confirmedLabel}
        confirmed={confirmed}
      />
      <Handle
        x={x}
        handle={handle}
        track={track}
        label={label}
        locked={disabled || confirmed}
        confirmed={confirmed}
        onRelease={release}
        onKeyDown={onKeyDown}
      />
      <span aria-live="polite" className="sr-only">
        {confirmed ? confirmedLabel : ""}
      </span>
    </div>
  );
};
