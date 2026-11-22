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
        <div className="flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-solid border-border bg-card p-6">
          <p className="m-0 text-sm font-medium text-foreground">首屏过渡已完成</p>
          <Button size="sm" variant="outline" onClick={() => setActive(true)}>
            重播入场过渡
          </Button>
        </div>
      )}
    </div>
  );
}
