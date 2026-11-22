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
import type { KeyboardEvent, RefObject } from "react";
import type { DragToConfirmProps } from "./drag-to-confirm.types.js";
import { useDragConfirm } from "./use-drag-confirm.js";

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
