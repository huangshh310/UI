"use client";

import { Badge, SpotlightCard } from "@matt-ui/ui";

export default function SpotlightCardBasicDemo() {
  return (
    <SpotlightCard className="w-full max-w-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="m-0 font-sans text-sm font-semibold text-foreground">纯 CSS 指针径向高光</p>
        <Badge variant="signal">零动画依赖</Badge>
      </div>
      <p className="m-0 mt-2 text-xs leading-relaxed text-muted-foreground">
        移动指针即可在卡片表面追踪柔和的钴蓝光晕，由局部 CSS 变量驱动，无需加载任何动画引擎。
      </p>
    </SpotlightCard>
  );
}
