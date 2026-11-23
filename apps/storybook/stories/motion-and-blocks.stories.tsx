import {
  AiAgentCockpitBlock,
  AiAgentPlan,
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
  PromptQueue,
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
  AiToolCall,
  AiWorkspaceBlock,
  AuthBlock,
  BillingUsageBlock,
  Context,
  Conversation,
  ConversationContent,
  DashboardShellBlock,
  HeroBentoBlock,
  Message,
  MessageContent,
  ModelSelector,
  SettingsBlock,
  Shimmer,
  SpotlightCard,
  Suggestions,
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
      <div className="flex flex-wrap items-center gap-3">
        <ModelSelector />
        <Context />
        <Shimmer>正在深度推理上下文…</Shimmer>
      </div>
      <Conversation className="rounded-2xl border border-border p-2">
        <ConversationContent className="gap-3 py-2">
          <Message from="user">
            <MessageContent>设计一套无框流式 AI 对话原语</MessageContent>
          </Message>
          <Message from="assistant">
            <MessageContent>
              助手正文直接流淌于画布，配合统一轨迹线呈现推理与工具动作。
            </MessageContent>
          </Message>
        </ConversationContent>
      </Conversation>
      <PromptQueue items={[{ id: "q1", content: "追问深色主题下的对比度门禁" }]} />
      <Suggestions />
      <AiReasoning defaultExpanded />
      <AiChatThread />
      <AiAgentPlan />
      <AiVoiceStage />
      <AiToolCall toolName="search_registry" status="completed" />
      <AiApprovalCard title="授权执行生产迁移脚本" />
      <AiCitation />
      <AiArtifact
        title="ReleaseCard.tsx"
        code="export const Card = () => null;"
        preview={<div className="text-xs text-muted-foreground">实时组件预览</div>}
      />
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
