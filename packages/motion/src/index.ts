/**
 * @matt-ui/motion 的公开入口。
 * 只有从这里导出的内容才是对外承诺的接口。
 */
export {
  AiAgentActivity,
  AiAgentActivityHeader,
  AiAgentActivityItem,
  AiAgentActivityTimeline,
  useAiAgentActivity,
} from "./components/ai-agent-activity/index.js";
export type {
  AiAgentActivityHeaderProps,
  AiAgentActivityItemData,
  AiAgentActivityItemProps,
  AiAgentActivityProps,
  AiAgentActivityStatus,
  AiAgentActivityTimelineProps,
} from "./components/ai-agent-activity/index.js";
export { AiAgentCockpitBlock } from "./components/ai-agent-cockpit-block/index.js";
export type {
  AiAgentCockpitBlockProps,
  AiCockpitMode,
} from "./components/ai-agent-cockpit-block/index.js";
export { AiAgentPlan } from "./components/ai-agent-plan/index.js";
export type {
  AiAgentPlanProps,
  AiPlanStep,
  AiPlanStepStatus,
} from "./components/ai-agent-plan/index.js";
export { AiImageReveal } from "./components/ai-image-reveal/index.js";
export type {
  AiImageRevealHandle,
  AiImageRevealPhase,
  AiImageRevealProps,
} from "./components/ai-image-reveal/index.js";
export { AiOrb } from "./components/ai-orb/index.js";
export type { AiOrbProps, AiOrbSize, AiOrbState, AiOrbVariant } from "./components/ai-orb/index.js";
export {
  AiResponse,
  AiResponseActions,
  AiResponseContent,
  AiResponseHeader,
  AiResponseSources,
  AiResponseToolsSummary,
  safeHref,
  useAiResponse,
} from "./components/ai-response/index.js";
export type {
  AiResponseActionsProps,
  AiResponseContentProps,
  AiResponseHeaderProps,
  AiResponseProps,
  AiResponseSource,
  AiResponseSourcesProps,
  AiResponseStatus,
  AiResponseTool,
  AiResponseToolsSummaryProps,
} from "./components/ai-response/index.js";
export { PromptQueue } from "./components/prompt-queue/index.js";
export type { PromptQueueProps, QueuedPromptItem } from "./components/prompt-queue/index.js";
export { AiReasoning } from "./components/ai-reasoning/index.js";
export type {
  AiReasoningProps,
  AiReasoningStatus,
  AiReasoningStep,
} from "./components/ai-reasoning/index.js";
export { AiVoiceStage } from "./components/ai-voice-stage/index.js";
export type { AiVoiceStageProps } from "./components/ai-voice-stage/index.js";
export { AnimatedFileUpload } from "./components/animated-file-upload/index.js";
export type {
  AnimatedFileUploadProps,
  UploadAdapter,
  UploadAdapterHelpers,
  UploadFileItem,
  UploadFileStatus,
} from "./components/animated-file-upload/index.js";
export { AnimatedText } from "./components/animated-text/index.js";
export type { AnimatedTextMode, AnimatedTextProps } from "./components/animated-text/index.js";
export { AudioWaves } from "./components/audio-waves/index.js";
export type { AudioWavesProps, AudioWavesVariant } from "./components/audio-waves/index.js";
export { DragToConfirm } from "./components/drag-to-confirm/index.js";
export type { DragToConfirmProps } from "./components/drag-to-confirm/index.js";
export { FileManagerBlock } from "./components/file-manager-block/index.js";
export type {
  FileManagerBlockProps,
  ManagedFileEntry,
} from "./components/file-manager-block/index.js";
export { FolderTabCard } from "./components/folder-tab-card/index.js";
export type { FolderTabCardProps, FolderTabItem } from "./components/folder-tab-card/index.js";
export { HoldToConfirm } from "./components/hold-to-confirm/index.js";
export type { HoldToConfirmProps, HoldToConfirmTone } from "./components/hold-to-confirm/index.js";
export { IntroLoader } from "./components/intro-loader/index.js";
export type { IntroGreeting, IntroLoaderProps } from "./components/intro-loader/index.js";
export { LiquidToggle } from "./components/liquid-toggle/index.js";
export type { LiquidToggleProps } from "./components/liquid-toggle/index.js";
export { MagneticButton } from "./components/magnetic-button/index.js";
export type { MagneticButtonProps } from "./components/magnetic-button/index.js";
export { MorphingButton } from "./components/morphing-button/index.js";
export type {
  MorphingButtonProps,
  MorphingButtonStatus,
} from "./components/morphing-button/index.js";
export { MorphingDialog } from "./components/morphing-dialog/index.js";
export type { MorphingDialogProps } from "./components/morphing-dialog/index.js";
export { NumberFlow } from "./components/number-flow/index.js";
export type { NumberFlowProps } from "./components/number-flow/index.js";
export { OnboardingWizardBlock } from "./components/onboarding-wizard-block/index.js";
export type {
  OnboardingResult,
  OnboardingWizardBlockProps,
} from "./components/onboarding-wizard-block/index.js";
export { OtpInput } from "./components/otp-input/index.js";
export type { OtpInputProps, OtpValidationType } from "./components/otp-input/index.js";
export { PricingBlock } from "./components/pricing-block/index.js";
export type {
  BillingCycle,
  PricingBlockProps,
  PricingTier,
} from "./components/pricing-block/index.js";
export { ReorderList } from "./components/reorder-list/index.js";
export type { ReorderListItem, ReorderListProps } from "./components/reorder-list/index.js";
export { SegmentedControl } from "./components/segmented-control/index.js";
export type {
  SegmentedControlItem,
  SegmentedControlProps,
} from "./components/segmented-control/index.js";
export { SelectionBasket } from "./components/selection-basket/index.js";
export type {
  SelectionBasketAction,
  SelectionBasketProps,
} from "./components/selection-basket/index.js";
export { SpotlightSearch } from "./components/spotlight-search/index.js";
export type {
  SpotlightSearchItem,
  SpotlightSearchProps,
} from "./components/spotlight-search/index.js";
export { StaggeredList } from "./components/staggered-list/index.js";
export type { StaggeredListProps } from "./components/staggered-list/index.js";
export { StatsOverviewBlock } from "./components/stats-overview-block/index.js";
export type {
  StatsOverviewBlockProps,
  StatsPeriod,
} from "./components/stats-overview-block/index.js";
export { StretchSwitch } from "./components/stretch-switch/index.js";
export type { StretchSwitchProps } from "./components/stretch-switch/index.js";
