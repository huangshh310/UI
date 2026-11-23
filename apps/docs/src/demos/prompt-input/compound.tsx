"use client";

/**
 * 示例：PromptInput 复合子部件自由拼装（自定义工具开关 + 流式待发入队）。
 */
import {
  PromptInput,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@matt-ui/ui";
import { Globe, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";

const ToolTogglePill = ({
  active,
  onToggle,
  icon,
  label,
}: {
  active: boolean;
  onToggle: () => void;
  icon: ReactNode;
  label: string;
}) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onToggle}
    className={`inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-solid px-2.5 text-xs font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset ${
      active
        ? "border-signal/40 bg-signal/10 text-foreground"
        : "border-border/80 bg-transparent text-muted-foreground hover:text-foreground"
    }`}
  >
    {icon}
    {label}
  </button>
);

export default function PromptInputCompoundDemo() {
  const [webSearch, setWebSearch] = useState(true);
  const [deepThink, setDeepThink] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <PromptInput
        variant="default"
        status="streaming"
        onQueue={(text) => setQueue((prev) => [...prev, text])}
        onStop={() => setQueue([])}
      >
        <PromptInputHeader>
          <span className="inline-flex items-center gap-1 rounded-md bg-signal/10 px-2 py-0.5 font-mono text-[11px] font-medium text-signal">
            正在生成回答 · 继续输入可直接入队
          </span>
        </PromptInputHeader>
        <PromptInputTextarea placeholder="输入追问内容并按 Enter 加入待发队列…" />
        <PromptInputFooter>
          <PromptInputTools>
            <ToolTogglePill
              active={webSearch}
              onToggle={() => setWebSearch((v) => !v)}
              icon={<Globe aria-hidden="true" className="size-3.5" />}
              label="联网检索"
            />
            <ToolTogglePill
              active={deepThink}
              onToggle={() => setDeepThink((v) => !v)}
              icon={<Sparkles aria-hidden="true" className="size-3.5" />}
              label="深度推理"
            />
          </PromptInputTools>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
      {queue.length > 0 && (
        <p className="m-0 px-1.5 font-mono text-xs text-muted-foreground">
          待发队列 ({queue.length})：{queue[queue.length - 1]}
        </p>
      )}
    </div>
  );
}
