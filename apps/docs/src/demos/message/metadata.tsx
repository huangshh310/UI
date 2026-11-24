/**
 * 示例：Message 全左对齐极简流（flat）与元信息头组合。
 */
import { Message, MessageContent } from "@matt-ui/ui";

export default function MessageMetadataDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 rounded-xl border border-solid border-border bg-card p-4 shadow-xs dark:border-white/10">
      <Message from="user" variant="flat" author="林夕" timestamp="刚刚">
        <MessageContent>帮我对比一下当前按钮组件的焦点环在暗色模式下的对比度。</MessageContent>
      </Message>
      <Message
        from="assistant"
        variant="flat"
        author="Matt Assistant"
        model="Matt Flash 3"
        timestamp="0.4s"
        avatar={
          <span className="inline-flex size-5 items-center justify-center rounded-md border border-solid border-border bg-muted font-mono text-[10px] font-semibold text-foreground dark:border-white/10 dark:bg-white/10">
            M
          </span>
        }
      >
        <MessageContent>
          已核对全部 7 个交互控件：均使用统一单层内嵌焦点环，暗色主题下对比度达到
          5.8:1，无双边框叠影。
        </MessageContent>
      </Message>
    </div>
  );
}
