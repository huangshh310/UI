"use client";

import { ThinkingOrb, type ThinkingOrbState } from "@matt-ui/ui";
import { useState } from "react";

const STATES: { id: ThinkingOrbState; label: string }[] = [
  { id: "working", label: "处理中" },
  { id: "searching", label: "检索中" },
  { id: "solving", label: "求解中" },
  { id: "listening", label: "聆听" },
  { id: "weaving", label: "编织" },
];

export default function ThinkingOrbBasicDemo() {
  const [state, setState] = useState<ThinkingOrbState>("working");

  return (
    <div className="flex flex-col items-center gap-5">
      <ThinkingOrb state={state} size={116} />
      <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-border/80 bg-card/90 p-1 shadow-xs">
        {STATES.map((item) => {
          const active = item.id === state;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setState(item.id)}
              aria-pressed={active}
              className={`cursor-pointer rounded-full border-0 px-2.5 py-1 font-sans text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? "bg-primary font-medium text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
