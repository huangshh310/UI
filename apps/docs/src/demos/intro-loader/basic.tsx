"use client";

import { IntroLoader } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { useState } from "react";

export default function IntroLoaderBasicDemo() {
  const [active, setActive] = useState(true);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      {active ? (
        <IntroLoader
          active={active}
          fullscreen={false}
          durationMs={3200}
          onComplete={() => setActive(false)}
        />
      ) : (
        <div className="relative flex min-h-48 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[22px] border border-solid border-border/85 bg-card p-6 text-center shadow-md">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 size-44 rounded-full bg-gradient-to-br from-signal/18 via-indigo-500/15 to-cyan-400/12 blur-2xl"
          />
          <span className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-solid border-blue-600/25 bg-blue-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-blue-800 dark:border-blue-400/25 dark:bg-blue-400/15 dark:text-blue-200">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
            Brand Motion Splash
          </span>
          <p className="relative z-10 m-0 text-sm font-semibold tracking-tight text-foreground">
            首屏过渡已完成
          </p>
          <p className="relative z-10 m-0 text-xs text-muted-foreground">
            柔焦字标切换 · 减少动效时自动跳过
          </p>
          <Button
            size="sm"
            variant="signal"
            onClick={() => setActive(true)}
            className="relative z-10 mt-1"
          >
            重播入场过渡
          </Button>
        </div>
      )}
    </div>
  );
}
