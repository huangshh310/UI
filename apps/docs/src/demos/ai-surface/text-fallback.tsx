"use client";

/**
 * 示例：图形化视图与 renderSurfaceText 纯文本降级实时对照，附带可复制的模型系统提示词规范。
 */
import {
  AiSurface,
  renderSurfaceText,
  type SurfaceDataSchema,
  type SurfaceView,
} from "@matt-ui/ui";
import { useState } from "react";

const PROMPT_CONTRACT = `你是结构化界面生成助手。请仅输出符合 SurfaceView 契约的 JSON（禁止输出 HTML、className 或内联样式）：
1. 顶层分区：{ "title"?: string, "main": SurfaceNode | SurfaceNode[], "dock"?: SurfaceNode | SurfaceNode[], "layer"?: SurfaceNode | SurfaceNode[] }
2. 容器节点：stack | grid | card (含 head/end/foot/children) | group | tabs
3. 展示节点：text | kv | stats | badge | progress | table | code | alert | empty
4. 交互节点：control (通过 scope: "#/properties/<field>" 绑定 schema) | button (intent: "submit"|"cancel"|"primary"|"outline") | actions
5. 智能体扩展：approval | diff | tool-call | artifact | citation | tree
6. 语义信号：使用 tone ("neutral"|"signal"|"success"|"warning"|"danger"|"info") 与 status ("idle"|"pending"|"running"|"done"|"error"|"cancelled") 表达状态。
7. 流式增量更新时输出 SurfacePatch[]：支持 replace / mergeProps / appendItems / remove，targetId 取自路径派生 ID（如 "main.rollout.traffic"）。`;

const TAB_ACTIVE =
  "cursor-pointer rounded-md border border-solid border-border bg-card px-2.5 py-1 font-sans text-xs font-medium text-foreground shadow-2xs outline-none focus-visible:ring-2 focus-visible:ring-ring";

const TAB_IDLE =
  "cursor-pointer rounded-md border border-solid border-transparent bg-transparent px-2.5 py-1 font-sans text-xs text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

const SCHEMA: SurfaceDataSchema = {
  properties: {
    note: { type: "string", title: "巡检备注", default: "核心链路延迟平稳" },
  },
};

const VIEW: SurfaceView = {
  title: "每日稳定性摘要",
  main: {
    kind: "card",
    key: "digest",
    head: { title: "网关健康巡检", status: "done" },
    children: [
      {
        kind: "kv",
        items: [
          { label: "可用率", value: "99.99%" },
          { label: "错误预算剩余", value: "94.2%" },
        ],
      },
      { kind: "control", scope: "#/properties/note", label: "巡检备注" },
    ],
  },
};

const FallbackToolbar = ({
  mode,
  copied,
  onModeChange,
  onCopy,
}: {
  mode: "text" | "prompt";
  copied: boolean;
  onModeChange: (next: "text" | "prompt") => void;
  onCopy: () => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-solid border-border/75 bg-muted/35 px-3.5 py-2">
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onModeChange("text")}
        className={mode === "text" ? TAB_ACTIVE : TAB_IDLE}
      >
        纯文本降级摘要
      </button>
      <button
        type="button"
        onClick={() => onModeChange("prompt")}
        className={mode === "prompt" ? TAB_ACTIVE : TAB_IDLE}
      >
        模型提示词规范
      </button>
    </div>
    {mode === "prompt" && (
      <button
        type="button"
        onClick={onCopy}
        className="cursor-pointer rounded-lg border border-solid border-border bg-card px-2.5 py-1 font-sans text-xs font-medium text-foreground shadow-xs outline-none hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copied ? "已复制规范" : "复制提示词契约"}
      </button>
    )}
  </div>
);

export const AiSurfaceTextFallback = () => {
  const [data, setData] = useState<Record<string, unknown>>({ note: "核心链路延迟平稳" });
  const [mode, setMode] = useState<"text" | "prompt">("text");
  const [copied, setCopied] = useState(false);

  const rightOutput = mode === "text" ? renderSurfaceText(VIEW, data) : PROMPT_CONTRACT;

  const copyPrompt = () => {
    navigator.clipboard?.writeText(PROMPT_CONTRACT).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
      <AiSurface
        schema={SCHEMA}
        uischema={VIEW}
        data={data}
        onDataChange={(next) => setData(next)}
      />
      <div className="flex flex-col overflow-hidden rounded-xl border border-solid border-border bg-card">
        <FallbackToolbar mode={mode} copied={copied} onModeChange={setMode} onCopy={copyPrompt} />
        <pre
          data-testid="surface-text-output"
          className="m-0 flex-1 overflow-auto p-3.5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground"
        >
          {rightOutput}
        </pre>
      </div>
    </div>
  );
};

export default AiSurfaceTextFallback;
