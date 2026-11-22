import StatsOverviewBlockBasicDemo from "@/demos/stats-overview-block/basic";
import StatsOverviewBlockQuarterDemo from "@/demos/stats-overview-block/quarter";
import type { ComponentDoc } from "./registry.types";

export const STATS_OVERVIEW_BLOCK_DOC: ComponentDoc = {
  slug: "stats-overview-block",
  name: "Stats Overview Block",
  description: "由 NumberFlow 滚动数字与周期分段切换组合的多维度业务 KPI 指标概览区块。",
  category: "blocks",
  registryName: "stats-overview-block",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { StatsOverviewBlock } from "@/components/ui/stats-overview-block";

export function Example() {
  return <StatsOverviewBlock />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "月度 SaaS 指标与周期滚动对比",
      description: "在近 7 天、近 30 天与本季度间切换，四组 KPI 数字按位滚轮平滑更新。",
      file: "stats-overview-block/basic.tsx",
      Demo: StatsOverviewBlockBasicDemo,
    },
    {
      slug: "quarter",
      name: "季度经营看板初始视角",
      description: '通过 defaultPeriod="quarter" 默认聚焦季度目标达成进度与增量表现。',
      file: "stats-overview-block/quarter.tsx",
      Demo: StatsOverviewBlockQuarterDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "defaultPeriod",
      type: '"7d" | "30d" | "quarter"',
      defaultValue: '"30d"',
      description: "初始统计周期",
    },
  ],
  accessibility: [
    "周期切换按钮暴露 aria-pressed 状态，NumberFlow 保留完整可读文本给屏幕阅读器。",
    "遵守 prefers-reduced-motion，减弱动效时直接刷新数值。",
  ],
};
