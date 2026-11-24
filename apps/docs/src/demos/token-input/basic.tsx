"use client";

/**
 * 示例：TokenInput 结构化上下文标签输入框，混排自然语言与原子化文件/技能胶囊并实时输出序列化文本。
 */
import {
  TokenInput,
  serializeTokenValue,
  type TokenInputSegment,
  type TokenTriggerSource,
} from "@matt-ui/ui";
import { useState } from "react";

const CONTEXT_TRIGGERS: TokenTriggerSource[] = [
  {
    char: "@",
    type: "file",
    items: [
      { value: "src/router.ts", label: "router.ts", badge: "TS" },
      { value: "src/auth/guard.ts", label: "guard.ts", badge: "TS" },
      { value: "docs/api.md", label: "api.md", badge: "MD" },
    ],
  },
  {
    char: "/",
    type: "skill",
    boundary: "start",
    items: [
      { value: "audit", label: "audit", badge: "技能" },
      { value: "benchmark", label: "benchmark", badge: "技能" },
    ],
  },
];

const INITIAL_SEGMENTS: TokenInputSegment[] = [
  { type: "skill", value: "audit", label: "audit", tone: "signal" },
  " 请对照 ",
  { type: "file", value: "src/router.ts", label: "router.ts", tone: "default" },
  " 检查鉴权中间件覆盖率",
];

export const TokenInputBasic = () => {
  const [serialized, setSerialized] = useState(() => serializeTokenValue(INITIAL_SEGMENTS));

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <TokenInput
        ariaLabel="结构化任务上下文"
        defaultValue={INITIAL_SEGMENTS}
        triggers={CONTEXT_TRIGGERS}
        onValueChange={(_, text) => setSerialized(text)}
      />
      <div
        data-testid="token-serialized-output"
        className="px-1 font-mono text-xs text-muted-foreground"
      >
        {serialized || "—"}
      </div>
    </div>
  );
};
