"use client";

import { SpotlightCard } from "@matt-ui/ui";

export default function SpotlightCardSurfacesDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
      <SpotlightCard variant="default" tone="neutral" padding="sm">
        <p className="m-0 text-xs font-medium text-muted-foreground">default</p>
        <p className="m-0 mt-1 text-sm font-semibold text-foreground">标准 1px 发丝边框卡片</p>
        <p className="m-0 mt-1 text-xs text-muted-foreground">
          轻量贴合画布，适合常规 Bento 网格。
        </p>
      </SpotlightCard>
      <SpotlightCard variant="elevated" tone="signal" padding="sm">
        <p className="m-0 text-xs font-medium text-muted-foreground">elevated</p>
        <p className="m-0 mt-1 text-sm font-semibold text-foreground">抬升层次与顶边高光</p>
        <p className="m-0 mt-1 text-xs text-muted-foreground">
          柔和阴影搭配微弱顶边反光，视觉更具纵深。
        </p>
      </SpotlightCard>
      <SpotlightCard variant="glass" tone="violet" padding="sm">
        <p className="m-0 text-xs font-medium text-muted-foreground">glass</p>
        <p className="m-0 mt-1 text-sm font-semibold text-foreground">半透明磨砂玻璃材质</p>
        <p className="m-0 mt-1 text-xs text-muted-foreground">
          启用 backdrop-blur 营造通透轻盈浮层感。
        </p>
      </SpotlightCard>
      <SpotlightCard variant="dark" tone="emerald" padding="sm">
        <p className="m-0 text-xs font-medium text-neutral-300">dark</p>
        <p className="m-0 mt-1 text-sm font-semibold text-neutral-50">黑曜石展示卡面</p>
        <p className="m-0 mt-1 text-xs text-neutral-300">
          高对比镜面微光，适合代码预览与黑卡特性展示。
        </p>
      </SpotlightCard>
    </div>
  );
}
