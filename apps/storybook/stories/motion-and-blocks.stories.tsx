import {
  AiAgentCockpitBlock,
  AiAgentPlan,
  AiCanvasCard,
  AiOrb,
  AiReasoning,
  AiVoiceStage,
  AnimatedText,
  AudioWaves,
  FileManagerBlock,
  FolderTabCard,
  HoldToConfirm,
  NumberFlow,
  OnboardingWizardBlock,
  PricingBlock,
  SegmentedControl,
  StaggeredList,
  StatsOverviewBlock,
} from "@matt-ui/motion";
import {
  ActivityFeedBlock,
  AiApprovalCard,
  AiArtifact,
  AiChatThread,
  AiCitation,
  AiDiffReview,
  AiModelSelector,
  AiPromptGallery,
  AiTokenMeter,
  AiToolCall,
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
  title: "Motion & Blocks/AI、动效与页面区块",
};

export default meta;

export const AiAndTactileComponents: StoryObj = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <AiOrb state="thinking" variant="aurora" pill />
        <AiOrb state="listening" variant="lattice" pill />
        <AudioWaves defaultActive />
      </div>
      <SegmentedControl
        items={[
          { value: "chat", label: "智能对话" },
          { value: "voice", label: "实时语音", badge: "Live" },
          { value: "research", label: "深度研究" },
        ]}
      />
      <HoldToConfirm label="长按部署生产环境" />
      <AiReasoning defaultExpanded />
      <AiChatThread />
      <AiModelSelector />
      <AiPromptGallery />
      <AiAgentPlan />
      <AiVoiceStage />
      <AiCanvasCard />
      <AiToolCall toolName="search_registry" status="completed" />
      <AiApprovalCard title="授权执行生产迁移脚本" />
      <AiCitation />
      <AiArtifact
        title="ReleaseCard.tsx"
        code="export const Card = () => null;"
        preview={<div className="text-xs text-muted-foreground">实时组件预览</div>}
      />
      <AiTokenMeter />
      <AiDiffReview />
    </div>
  ),
};

export const MotionEffects: StoryObj = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-6">
      <NumberFlow value={4890} prefix="¥" suffix="/月" className="text-3xl" />
      <AnimatedText mode="cycle" phrases={["中性克制", "钴蓝聚焦", "无障碍优先"]} />
      <SpotlightCard>指针跟随纯 CSS 径向高光卡片。</SpotlightCard>
      <FolderTabCard
        tabs={[
          { id: "a", label: "核心", metric: "57", content: "核心原语与 AI 组件集" },
          { id: "b", label: "动效", metric: "26", content: "弹簧动效与多模态区块集" },
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
      <AiAgentCockpitBlock />
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
