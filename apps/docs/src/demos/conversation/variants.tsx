/**
 * 示例：ConversationScrollButton 圆形极简悬浮按钮与未读角标预览。
 */
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  Message,
  MessageContent,
} from "@matt-ui/ui";

export default function ConversationVariantsDemo() {
  return (
    <Conversation variant="surface" fadeEdges unreadCount={3} className="h-52 w-full max-w-2xl">
      <ConversationContent size="sm">
        <Message from="user">
          <MessageContent>可以把回到底部按钮做成更轻量的圆形悬浮箭头吗？</MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent>
            将 ConversationScrollButton 设置为 variant=&quot;icon&quot;
            即可切换为极简圆形悬浮按钮，并自动在右上角挂载未读计数徽章。
          </MessageContent>
        </Message>
      </ConversationContent>
      <ConversationScrollButton variant="icon" forceVisible />
    </Conversation>
  );
}
