import StatsOverviewBlockBasicDemo from "@/demos/stats-overview-block/basic";
import StatsOverviewBlockBentoDemo from "@/demos/stats-overview-block/bento";
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
    {
      slug: "bento",
      name: "一体化 Bento 发丝网格与紧凑密度",
      description: '组合 variant="bento"、columns={2} 与 compact，呈现紧凑高密度的控制台指标条。',
      file: "stats-overview-block/bento.tsx",
      Demo: StatsOverviewBlockBentoDemo,
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
    {
      name: "variant",
      type: '"cards" | "bento" | "minimal"',
      defaultValue: '"cards"',
      description: "指标容器视觉变体",
    },
    {
      name: "columns",
      type: "2 | 4",
      defaultValue: "4",
      description: "宽屏下的网格列数",
    },
    {
      name: "compact",
      type: "boolean",
      defaultValue: "false",
      description: "是否启用紧凑密度并隐藏底部进度条",
    },
    {
      name: "title",
      type: "string",
      defaultValue: '"数据概览"',
      description: "区块主标题",
    },
    {
      name: "description",
      type: "string",
      defaultValue: '"按周期查看增长与订阅健康度"',
      description: "区块副标题说明",
    },
    {
      name: "onPeriodChange",
      type: "(period: StatsPeriod) => void",
      defaultValue: "—",
      description: "切换统计周期时的回调",
    },
  ],
  accessibility: [
    "周期切换按钮组带有 role=group 与 aria-pressed 状态，NumberFlow 保留完整可读文本给屏幕阅读器。",
    "趋势徽章同时以方向图标与数值文案表达增减，浅色与深色主题均满足 WCAG AA 对比度。",
    "遵守 prefers-reduced-motion，减弱动效时直接刷新数值与进度条。",
  ],
};
