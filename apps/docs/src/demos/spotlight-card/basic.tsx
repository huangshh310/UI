"use client";

import { Badge, SpotlightCard } from "@matt-ui/ui";
import { Sparkles } from "lucide-react";

export default function SpotlightCardBasicDemo() {
  return (
    <SpotlightCard tone="signal" variant="elevated" className="w-full max-w-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-secondary text-foreground">
          <Sparkles aria-hidden="true" className="size-4" />
        </span>
        <Badge variant="signal">零动画依赖</Badge>
      </div>
      <p className="m-0 mt-4 font-sans text-sm font-semibold tracking-tight text-foreground">
        纯 CSS 指针径向高光与镜面边框
      </p>
      <p className="m-0 mt-1.5 text-xs leading-relaxed text-muted-foreground">
        移动指针即可在卡片表面与 1px 发丝边框上同步追踪柔和光晕，由局部 CSS
        变量驱动，零运行时动画引擎开销。
      </p>
    </SpotlightCard>
  );
}
