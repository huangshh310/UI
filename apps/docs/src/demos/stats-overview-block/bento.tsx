"use client";

import { StatsOverviewBlock } from "@matt-ui/motion";

export default function StatsOverviewBlockBentoDemo() {
  return (
    <StatsOverviewBlock
      defaultPeriod="7d"
      variant="bento"
      columns={2}
      compact
      title="边缘分发实时遥测"
      description="一体化无缝发丝分割面板，适合嵌入控制台侧栏或概览顶部"
      className="w-full"
    />
  );
}
