import {
  AnimatedText,
  FileManagerBlock,
  FolderTabCard,
  NumberFlow,
  OnboardingWizardBlock,
  PricingBlock,
  StaggeredList,
  StatsOverviewBlock,
} from "@matt-ui/motion";
import {
  ActivityFeedBlock,
  AiWorkspaceBlock,
  AuthBlock,
  BillingUsageBlock,
  DashboardShellBlock,
  HeroBentoBlock,
  SettingsBlock,
  SpotlightCard,
  TeamMembersBlock,
} from "@matt-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Motion & Blocks/动效与页面区块",
};

export default meta;

export const MotionEffects: StoryObj = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-6">
      <NumberFlow value={4890} prefix="¥" suffix="/月" className="text-3xl" />
      <AnimatedText mode="cycle" phrases={["中性克制", "钴蓝聚焦", "无障碍优先"]} />
      <SpotlightCard>指针跟随纯 CSS 径向高光卡片。</SpotlightCard>
      <FolderTabCard
        tabs={[
          { id: "a", label: "核心", metric: "51", content: "核心原语与区块集" },
          { id: "b", label: "动效", metric: "20", content: "弹簧动效与区块集" },
        ]}
      />
      <StaggeredList>
        <div className="rounded-lg border border-border p-3 text-xs">条目 1</div>
        <div className="rounded-lg border border-border p-3 text-xs">条目 2</div>
      </StaggeredList>
    </div>
  ),
};

export const ComposableBlocks: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-8">
      <HeroBentoBlock />
      <StatsOverviewBlock />
      <AuthBlock layout="split" />
      <PricingBlock />
      <DashboardShellBlock />
      <TeamMembersBlock />
      <BillingUsageBlock />
      <ActivityFeedBlock />
      <AiWorkspaceBlock />
      <SettingsBlock />
      <FileManagerBlock />
      <OnboardingWizardBlock />
    </div>
  ),
};
