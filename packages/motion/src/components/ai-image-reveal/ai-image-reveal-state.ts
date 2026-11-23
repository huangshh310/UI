"use client";

/**
 * AiImageReveal 显影阶段与重播状态控制器。
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type RevealEngineState,
  runCanvasLoop,
  useImageLoaderEffect,
  useRevealBoxSize,
} from "./ai-image-reveal-canvas.js";
import type { AiImageRevealPhase } from "./ai-image-reveal.types.js";

export interface RevealControllerInput {
  src?: string | null;
  generating?: boolean;
  colors?: string[];
  density: number;
  duration: number;
  crossOrigin: "" | "anonymous" | "use-credentials";
  reduce: boolean;
  onReveal?: () => void;
  onImageError?: () => void;
}

const useLatestRevealRefs = (input: RevealControllerInput) => {
  const durationRef = useRef(input.duration);
  const callbacksRef = useRef({ onReveal: input.onReveal, onImageError: input.onImageError });
  useEffect(() => {
    durationRef.current = input.duration;
    callbacksRef.current = { onReveal: input.onReveal, onImageError: input.onImageError };
  }, [input.duration, input.onReveal, input.onImageError]);
  return { durationRef, callbacksRef };
};

const useCanvasLoopEffect = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  engineRef: React.RefObject<RevealEngineState>,
  size: { w: number; h: number },
  input: RevealControllerInput,
  durationRef: React.RefObject<number>,
  onRefine: () => void,
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !size.w || !size.h || input.reduce) return;
    return runCanvasLoop(canvas, ctx, engineRef.current, {
      w: size.w,
      h: size.h,
      density: input.density,
      colors: input.colors,
      durationRef,
      onRefine,
    });
  }, [
    canvasRef,
    engineRef,
    size.w,
    size.h,
    input.density,
    input.colors,
    input.reduce,
    durationRef,
    onRefine,
  ]);
};

const useRefineFinishEffect = (phase: AiImageRevealPhase, delayMs: number, onDone: () => void) => {
  useEffect(() => {
    if (phase !== "refine") return;
    const id = window.setTimeout(onDone, delayMs);
    return () => window.clearTimeout(id);
  }, [phase, delayMs, onDone]);
};

const useRevealPhaseActions = (
  cycleKey: string,
  callbacksRef: React.RefObject<{ onReveal?: () => void; onImageError?: () => void }>,
  setState: React.Dispatch<
    React.SetStateAction<{ key: string; phase: AiImageRevealPhase; loadedSrc: string | null }>
  >,
) => {
  const handleRefine = useCallback(
    () => setState((p) => ({ key: cycleKey, phase: "refine", loadedSrc: p.loadedSrc })),
    [cycleKey, setState],
  );
  const handleDone = useCallback(() => {
    setState((p) => ({ key: cycleKey, phase: "done", loadedSrc: p.loadedSrc }));
    callbacksRef.current.onReveal?.();
  }, [cycleKey, callbacksRef, setState]);
  const handlePhase = useCallback(
    (p: AiImageRevealPhase, s: string | null) =>
      setState({ key: cycleKey, phase: p, loadedSrc: s }),
    [cycleKey, setState],
  );
  const handleError = useCallback(() => callbacksRef.current.onImageError?.(), [callbacksRef]);
  return { handleRefine, handleDone, handlePhase, handleError };
};

export const useImageRevealController = (
  boxRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  input: RevealControllerInput,
) => {
  const size = useRevealBoxSize(boxRef);
  const [runId, setRunId] = useState(0);
  const [state, setState] = useState<{
    key: string;
    phase: AiImageRevealPhase;
    loadedSrc: string | null;
  }>({ key: "", phase: "idle", loadedSrc: null });

  const waiting = input.generating ?? !input.src;
  const cycleKey = `${waiting ? "wait" : (input.src ?? "")}:${runId}`;
  const phase: AiImageRevealPhase = !waiting && state.key === cycleKey ? state.phase : "idle";
  const loadedSrc = !waiting && state.key === cycleKey ? state.loadedSrc : null;
  const { durationRef, callbacksRef } = useLatestRevealRefs(input);
  const engineRef = useRef<RevealEngineState>({
    field: null,
    mode: "idle",
    gatherStart: -1,
    refined: false,
    kick: () => {},
  });

  const replay = useCallback(() => setRunId((n) => n + 1), []);
  const { handleRefine, handleDone, handlePhase, handleError } = useRevealPhaseActions(
    cycleKey,
    callbacksRef,
    setState,
  );

  useCanvasLoopEffect(canvasRef, engineRef, size, input, durationRef, handleRefine);
  useImageLoaderEffect(engineRef, {
    ...input,
    waiting,
    runId,
    w: size.w,
    h: size.h,
    onPhase: handlePhase,
    onError: handleError,
  });
  useRefineFinishEffect(phase, (input.reduce ? 0.3 : input.duration * 0.4) * 1000, handleDone);

  return { phase, loadedSrc, replay };
};
