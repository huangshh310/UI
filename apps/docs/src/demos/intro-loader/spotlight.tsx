"use client";

import { IntroLoader } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { useState } from "react";

export default function IntroLoaderSpotlightDemo() {
  const [active, setActive] = useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      {active ? (
        <IntroLoader
          active={active}
          fullscreen={false}
          variant="spotlight"
          tone="signal"
          durationMs={2200}
          subtitle="Design System · v2.4"
          greetings={[
            { text: "Crafted", lang: "01" },
            { text: "Accessible", lang: "02" },
            { text: "matt-ui", lang: "03" },
          ]}
          onComplete={() => setActive(false)}
        />
      ) : (
        <div className="flex min-h-44 w-full flex-col items-center justify-center gap-2.5 rounded-[22px] border border-solid border-border/80 bg-card/90 p-6 text-center shadow-xs dark:border-white/10">
          <p className="m-0 text-sm font-semibold tracking-tight text-foreground">
            Spotlight 柔光与信号蓝进度条
          </p>
          <p className="m-0 text-xs text-muted-foreground">
            适合品牌发布页与产品引导首屏，支持随时点击跳过或按 Esc 退出。
          </p>
          <Button size="sm" variant="signal" onClick={() => setActive(true)} className="mt-1">
            播放 Spotlight 过场
          </Button>
        </div>
      )}
    </div>
  );
}
