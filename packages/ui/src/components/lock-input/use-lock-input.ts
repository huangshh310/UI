"use client";

/**
 * LockInput 的交互状态管理：值（受控/非受控）、锁定态、密码显隐与一键复制反馈。
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Ref,
  type RefObject,
} from "react";
import type { LockInputProps } from "./lock-input.types.js";

const assignInputRef = (
  target: Ref<HTMLInputElement> | undefined,
  value: HTMLInputElement | null,
) => {
  if (typeof target === "function") {
    target(value);
  } else if (target && typeof target === "object") {
    target.current = value;
  }
};

/** 合并内部 ref 与外部透传的 ref */
export const useMergedInputRef = (forwardedRef?: Ref<HTMLInputElement>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const bindInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignInputRef(forwardedRef, node);
    },
    [forwardedRef],
  );
  return { inputRef, bindInputRef };
};

/** 追踪一键复制后的短暂确认态，卸载时清理定时器 */
export const useCopyFeedback = (onCopy?: (value: string) => void) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const triggerCopy = (text: string) => {
    void navigator.clipboard?.writeText(text);
    onCopy?.(text);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1600);
  };

  return { copied, triggerCopy };
};

export const useLockInputState = (
  props: LockInputProps,
  inputRef: RefObject<HTMLInputElement | null>,
) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    String(props.defaultValue ?? ""),
  );
  const [internalLocked, setInternalLocked] = useState(props.defaultLocked ?? false);
  const [revealed, setRevealed] = useState(false);

  const isLocked = props.locked ?? internalLocked;
  const currentValue = props.value !== undefined ? String(props.value) : uncontrolledValue;
  const inputType = props.type ?? "text";
  const resolvedType =
    props.revealable && inputType === "password" && revealed ? "text" : inputType;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.value === undefined) setUncontrolledValue(event.target.value);
    props.onChange?.(event);
  };

  const handleClear = () => {
    if (props.value === undefined) {
      setUncontrolledValue("");
      if (inputRef.current) inputRef.current.value = "";
    }
    props.onClear?.();
    inputRef.current?.focus();
  };

  const handleToggleLock = () => {
    const next = !isLocked;
    if (props.locked === undefined) setInternalLocked(next);
    props.onLockedChange?.(next);
    if (!next) requestAnimationFrame(() => inputRef.current?.focus());
  };

  const toggleReveal = () => setRevealed((prev) => !prev);

  return {
    isLocked,
    currentValue,
    revealed,
    resolvedType,
    toggleReveal,
    handleChange,
    handleClear,
    handleToggleLock,
  };
};
