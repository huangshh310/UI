"use client";

import { AiOrb, type AiOrbState } from "@matt-ui/motion";
import { useState } from "react";

const STATES: { id: AiOrbState; label: string }[] = [
  { id: "thinking", label: "思考" },
  { id: "listening", label: "聆听" },
  { id: "speaking", label: "回应" },
  { id: "idle", label: "待命" },
];

export default function AiOrbBasicDemo() {
  const [state, setState] = useState<AiOrbState>("thinking");

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-solid border-border/85 bg-card p-6 shadow-xs">
      <div className="flex items-center justify-center gap-7 py-2">
        <div className="flex flex-col items-center gap-2.5">
          <AiOrb state={state} variant="aurora" size="lg" />
          <span className="font-mono text-[11px] text-muted-foreground">Aurora</span>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <AiOrb state={state} variant="lattice" size="lg" />
          <span className="font-mono text-[11px] text-muted-foreground">Lattice</span>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <AiOrb state={state} variant="ring" size="lg" />
          <span className="font-mono text-[11px] text-muted-foreground">Ring</span>
        </div>
      </div>
      <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-solid border-border/80 bg-secondary/70 p-1">
        {STATES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={state === item.id}
            onClick={() => setState(item.id)}
            className={`cursor-pointer rounded-full border-0 px-3 py-1 font-sans text-xs font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              state === item.id
                ? "bg-card text-foreground shadow-xs"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
