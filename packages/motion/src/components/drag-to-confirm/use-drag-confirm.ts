/**
 * 拖动确认的状态逻辑：滑块位置、是否已确认、松手后的判定、震动反馈与自动复位。
 */
import { animate, useMotionValue, useReducedMotion, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";

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

export const useDragConfirm = ({
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
