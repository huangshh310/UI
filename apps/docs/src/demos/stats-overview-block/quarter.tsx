"use client";

import { StatsOverviewBlock } from "@matt-ui/motion";

export default function StatsOverviewBlockQuarterDemo() {
  return (
    <StatsOverviewBlock
      defaultPeriod="quarter"
      variant="minimal"
      title="季度经营总览"
      description="轻底色极简指标带，聚焦季度目标达成与环比增量"
      className="w-full"
    />
  );
}
