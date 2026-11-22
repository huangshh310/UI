"use client";

import { Badge, SpotlightCard } from "@matt-ui/ui";

export default function SpotlightCardGridDemo() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
      <SpotlightCard glowBorder tone="signal" className="flex flex-col gap-2 p-5">
        <Badge variant="signal" className="w-fit">
          Signal
        </Badge>
        <p className="m-0 text-sm font-semibold text-foreground">钴蓝径向微光</p>
        <p className="m-0 text-xs text-muted-foreground">适合主推特性与高价值入口卡片。</p>
      </SpotlightCard>
      <SpotlightCard glowBorder tone="neutral" className="flex flex-col gap-2 p-5">
        <Badge variant="secondary" className="w-fit">
          Neutral
        </Badge>
        <p className="m-0 text-sm font-semibold text-foreground">中性柔和聚光</p>
        <p className="m-0 text-xs text-muted-foreground">
          保持低噪墨色质感，在深色主题下尤为通透。
        </p>
      </SpotlightCard>
    </div>
  );
}
