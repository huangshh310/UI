/**
 * 拖动确认的状态逻辑：滑块位置、是否已确认、松手后的判定与自动复位。
 */
import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** 拖过轨道可用长度的这个比例即视为确认 */
const CONFIRM_RATIO = 0.9;

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

interface DragConfirmOptions {
  onConfirm?: (() => void) | undefined;
  onReset?: (() => void) | undefined;
  autoResetDelay: number;
}

export const useDragConfirm = ({ onConfirm, onReset, autoResetDelay }: DragConfirmOptions) => {
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
