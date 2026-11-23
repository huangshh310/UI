/**
 * 示例：Message 紧凑侧栏模式（compact）与全左对齐极简流（flat）。
 */
import { Message, MessageContent } from "@matt-ui/ui";
import { Sparkles } from "lucide-react";

export default function MessageMetadataDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-solid border-border/80 bg-card/80 p-4 dark:border-white/10">
      <Message from="user" variant="flat" author="林夕" timestamp="刚刚">
        <MessageContent>帮我对比一下当前按钮组件的焦点环在暗色模式下的对比度。</MessageContent>
      </Message>
      <Message
        from="assistant"
        variant="flat"
        author="Copilot"
        model="Gemini 3 Flash"
        timestamp="0.4s"
        avatar={
          <span className="inline-flex size-5 items-center justify-center rounded-md bg-signal/15 text-signal">
            <Sparkles aria-hidden="true" className="size-3" />
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
