/**
 * 示例：ConversationEmptyState 空态居中欢迎、模型徽章与灵感启动卡组合。
 */
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  Suggestions,
} from "@matt-ui/ui";

export default function ConversationEmptyDemo() {
  return (
    <Conversation variant="surface" className="w-full max-w-2xl">
      <ConversationContent>
        <ConversationEmptyState
          badge="Matt Pro 4 · 200K Context"
          title="今天想探索什么？"
          description="支持深度推理轨迹、代码审阅与多模型对比"
        >
          <Suggestions variant="cards" showCategoryFilter={false} />
        </ConversationEmptyState>
      </ConversationContent>
    </Conversation>
  );
}
