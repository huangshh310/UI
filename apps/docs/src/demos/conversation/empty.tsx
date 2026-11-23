/**
 * 示例：ConversationEmptyState 空态居中欢迎与灵感启动卡组合。
 */
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  Suggestions,
} from "@matt-ui/ui";

export default function ConversationEmptyDemo() {
  return (
    <Conversation className="w-full max-w-xl rounded-2xl border border-solid border-border/80 bg-background">
      <ConversationContent>
        <ConversationEmptyState
          title="今天想探索什么？"
          description="支持深度推理轨迹、代码审阅与多模型对比"
        >
          <Suggestions variant="cards" showCategoryFilter={false} />
        </ConversationEmptyState>
      </ConversationContent>
    </Conversation>
  );
}
