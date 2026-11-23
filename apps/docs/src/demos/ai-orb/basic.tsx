"use client";

import { AiOrb, type AiOrbState, type AiOrbVariant } from "@matt-ui/motion";
import { useState } from "react";

const STATES: { id: AiOrbState; label: string }[] = [
  { id: "thinking", label: "思考" },
  { id: "listening", label: "聆听" },
  { id: "speaking", label: "回应" },
  { id: "idle", label: "待命" },
];

const SHOWCASE_ORBS: { variant: AiOrbVariant; name: string; subtitle: string }[] = [
  { variant: "aurora", name: "Aurora", subtitle: "流体光学球" },
  { variant: "lattice", name: "Lattice", subtitle: "微型 OLED 矩阵" },
  { variant: "ring", name: "Ring", subtitle: "双轨声纹光环" },
];

const STAGE_GLOW: Record<AiOrbState, string> = {
  thinking: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(21,93,252,0.09), transparent 72%)",
  listening: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(2,132,199,0.09), transparent 72%)",
  speaking: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(5,150,105,0.09), transparent 72%)",
  idle: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(100,116,139,0.07), transparent 72%)",
};

export default function AiOrbBasicDemo() {
  const [state, setState] = useState<AiOrbState>("thinking");

  return (
    <div className="relative flex w-full max-w-xl flex-col items-center gap-6 overflow-hidden rounded-2xl border border-solid border-border bg-card p-6 shadow-xs sm:p-7 dark:border-white/10">
      <span
        aria-hidden="true"
        style={{ background: STAGE_GLOW[state] }}
        className="pointer-events-none absolute inset-0"
      />
      <div className="relative grid w-full grid-cols-1 gap-3.5 sm:grid-cols-3">
        {SHOWCASE_ORBS.map((item) => (
          <div
            key={item.variant}
            className="flex flex-col items-center gap-4 rounded-xl border border-solid border-border/70 bg-background/70 px-4 py-6 backdrop-blur-xs dark:border-white/8 dark:bg-white/[0.025]"
          >
            <div className="flex h-24 items-center justify-center">
              <AiOrb state={state} variant={item.variant} size="xl" />
            </div>
            <div className="flex flex-col items-center gap-0.5 text-center">
              <span className="font-mono text-xs font-semibold tracking-tight text-foreground">
                {item.name}
              </span>
              <span className="text-[11px] text-muted-foreground">{item.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="relative inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-solid border-border bg-muted/65 p-1 dark:border-white/10 dark:bg-white/[0.04]">
        {STATES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={state === item.id}
            onClick={() => setState(item.id)}
            className={`cursor-pointer rounded-full border border-solid px-3.5 py-1.5 font-sans text-xs font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset ${
              state === item.id
                ? "border-border/80 bg-card text-foreground shadow-xs dark:border-white/12 dark:bg-neutral-800"
                : "border-transparent bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
