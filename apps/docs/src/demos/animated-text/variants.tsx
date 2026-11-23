"use client";

import { AnimatedText } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

const VARIANTS = [
  { id: "fade-up" as const, label: "Fade Up", sample: "由底线遮罩轻盈浮现的标题排版" },
  { id: "blur-in" as const, label: "Blur In", sample: "模拟光学对焦渐清晰的现代质感" },
  { id: "slide" as const, label: "Slide", sample: "沿水平基线利落滑入的节奏表达" },
  { id: "wave" as const, label: "Wave", sample: "带弹簧波纹回弹的灵动逐词入场" },
];

export default function AnimatedTextVariantsDemo() {
  const [active, setActive] = useState(0);
  const [replay, setReplay] = useState(0);
  const current = VARIANTS[active] ?? VARIANTS[0];

  if (!current) return null;

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4 rounded-[22px] border border-solid border-border/90 bg-card p-6 text-center shadow-xs">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {VARIANTS.map((item, idx) => (
          <Button
            key={item.id}
            size="sm"
            variant={idx === active ? "primary" : "outline"}
            onClick={() => {
              setActive(idx);
              setReplay((n) => n + 1);
            }}
          >
            {item.label}
          </Button>
        ))}
        <Button
          size="sm"
          variant="ghost"
          aria-label="重播文字动效"
          onClick={() => setReplay((n) => n + 1)}
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
        </Button>
      </div>
      <div className="flex min-h-12 items-center justify-center">
        <AnimatedText
          key={`${current.id}-${replay}`}
          mode="reveal"
          variant={current.id}
          size="lg"
          tone={current.id === "wave" ? "emerald" : "default"}
          text={current.sample}
          className="font-semibold"
        />
      </div>
    </div>
  );
}
