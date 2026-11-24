import { AGENT_SCREEN_DOC } from "./agent-screen.doc";
import { AI_AGENT_ACTIVITY_DOC } from "./ai-agent-activity.doc";
import { AI_AGENT_PLAN_DOC } from "./ai-agent-plan.doc";
import { AI_APPROVAL_CARD_DOC } from "./ai-approval-card.doc";
import { AI_ARTIFACT_DOC } from "./ai-artifact.doc";
import { AI_CHAT_THREAD_DOC } from "./ai-chat-thread.doc";
import { AI_CITATION_DOC } from "./ai-citation.doc";
import { AI_DIFF_REVIEW_DOC } from "./ai-diff-review.doc";
import { AI_IMAGE_REVEAL_DOC } from "./ai-image-reveal.doc";
import { AI_LOADING_STATE_DOC } from "./ai-loading-state.doc";
import { AI_ORB_DOC } from "./ai-orb.doc";
import { AI_REASONING_DOC } from "./ai-reasoning.doc";
import { AI_RESPONSE_DOC } from "./ai-response.doc";
import { AI_STACK_TRACE_DOC } from "./ai-stack-trace.doc";
import { AI_SUBAGENTS_DOC } from "./ai-subagents.doc";
import { AI_SURFACE_AGENT_DOC } from "./ai-surface-agent.doc";
import { AI_SURFACE_DOC } from "./ai-surface.doc";
import { AI_TEST_RESULTS_DOC } from "./ai-test-results.doc";
import { AI_TOOL_CALL_DOC } from "./ai-tool-call.doc";
import { AI_VOICE_STAGE_DOC } from "./ai-voice-stage.doc";
import { AUDIO_WAVES_DOC } from "./audio-waves.doc";
import { CONTEXT_DOC } from "./context.doc";
import { CONVERSATION_DOC } from "./conversation.doc";
import { MESSAGE_DOC } from "./message.doc";
import { MODEL_SELECTOR_DOC } from "./model-selector.doc";
import { PROMPT_QUEUE_DOC } from "./prompt-queue.doc";
import { REASONING_EFFORT_DOC } from "./reasoning-effort.doc";
import { SELECTION_ACTIONS_DOC } from "./selection-actions.doc";
import { SHIMMER_DOC } from "./shimmer.doc";
import { SUGGESTION_DOC } from "./suggestion.doc";
import { THINKING_ORB_DOC } from "./thinking-orb.doc";
import { TOKEN_INPUT_DOC } from "./token-input.doc";
import { TRIGGER_MENU_DOC } from "./trigger-menu.doc";
import { WATERFALL_DOC } from "./waterfall.doc";
import type { ComponentDoc } from "./registry.types";

/** AI 与智能体分类下的全部组件文档清单 */
export const AI_COMPONENT_DOCS: ComponentDoc[] = [
  THINKING_ORB_DOC,
  AI_IMAGE_REVEAL_DOC,
  AI_LOADING_STATE_DOC,
  SELECTION_ACTIONS_DOC,
  AGENT_SCREEN_DOC,
  REASONING_EFFORT_DOC,
  AI_CHAT_THREAD_DOC,
  AI_SUBAGENTS_DOC,
  AI_TEST_RESULTS_DOC,
  AI_STACK_TRACE_DOC,
  AI_AGENT_ACTIVITY_DOC,
  AI_RESPONSE_DOC,
  CONVERSATION_DOC,
  MESSAGE_DOC,
  SHIMMER_DOC,
  MODEL_SELECTOR_DOC,
  CONTEXT_DOC,
  SUGGESTION_DOC,
  PROMPT_QUEUE_DOC,
  AI_ORB_DOC,
  AI_VOICE_STAGE_DOC,
  AUDIO_WAVES_DOC,
  AI_AGENT_PLAN_DOC,
  AI_REASONING_DOC,
  AI_TOOL_CALL_DOC,
  AI_APPROVAL_CARD_DOC,
  AI_CITATION_DOC,
  AI_ARTIFACT_DOC,
  AI_DIFF_REVIEW_DOC,
  AI_SURFACE_DOC,
  AI_SURFACE_AGENT_DOC,
  TRIGGER_MENU_DOC,
  TOKEN_INPUT_DOC,
  WATERFALL_DOC,
];
