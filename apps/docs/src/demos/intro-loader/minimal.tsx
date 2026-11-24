"use client";

import { IntroLoader } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { useState } from "react";

export default function IntroLoaderMinimalDemo() {
  const [active, setActive] = useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border border-solid border-border bg-card">
        <span className="text-xs text-muted-foreground">主工作区内容已就绪</span>
        <IntroLoader
          active={active}
          fullscreen={false}
          durationMs={1400}
          greetings={[{ text: "Design Tokens" }, { text: "A11y Primitives" }, { text: "matt-ui" }]}
          onComplete={() => setActive(false)}
        />
      </div>
      <Button size="sm" variant="outline" onClick={() => setActive(true)}>
        重播三段品牌过场
      </Button>
    </div>
  );
}
