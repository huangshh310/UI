"use client";

/**
 * DragToConfirm：必须把滑块拖到尽头才会确认的滑轨，用于删除、转账这类关键操作。
 *
 * 拖到九成以上松手即确认，否则滑块弹回起点；拖动过程中提示文字逐渐淡出。
 * 键盘用户可以聚焦滑块后按 Enter 或空格直接确认，这是拖动的替代方式。
 * 确认结果通过播报区告知屏幕阅读器。
 */
import { cn } from "@matt-ui/utils";
import { ArrowRight, Check } from "lucide-react";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { KeyboardEvent, ReactNode, RefObject } from "react";
import {
  DRAG_SIZE_CONFIG,
  DRAG_TONE_CONFIG,
  HANDLE_BASE_CLASSES,
  TRACK_BASE_CLASSES,
  TRACK_VARIANT_CLASSES,
  type DragSizeTokens,
  type DragToneTokens,
} from "./drag-to-confirm.styles.js";
import type { DragToConfirmProps, DragToConfirmVariant } from "./drag-to-confirm.types.js";
import { useDragConfirm } from "./use-drag-confirm.js";

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
