"use client";

/**
 * 示例：TokenInput 三种退格键胶囊删除策略（整块删除、先选中再删、退格还原纯文本）实时切换对比。
 */
import { TokenInput, type TokenDeletionMode, type TokenInputSegment } from "@matt-ui/ui";
import { useState } from "react";

const SEED_VALUE: TokenInputSegment[] = [
  "检查 ",
  { type: "file", value: "packages/ui/index.ts", label: "index.ts", tone: "signal" },
  " 与 ",
  { type: "file", value: "packages/tokens/light.css", label: "light.css", tone: "success" },
];

const MODES: { id: TokenDeletionMode; label: string }[] = [
  { id: "whole", label: "整块删除 (whole)" },
  { id: "select", label: "先选中再删 (select)" },
  { id: "revert", label: "还原纯文本 (revert)" },
];

export const TokenInputDeletionModes = () => {
  const [mode, setMode] = useState<TokenDeletionMode>("select");

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={
              mode === item.id
                ? "cursor-pointer rounded-lg border border-solid border-signal bg-signal/12 px-2.5 py-1 font-sans text-xs font-medium text-foreground"
                : "cursor-pointer rounded-lg border border-solid border-border bg-background px-2.5 py-1 font-sans text-xs text-muted-foreground hover:text-foreground"
            }
          >
            {item.label}
          </button>
        ))}
      </div>
      <TokenInput
        key={mode}
        ariaLabel="退格策略演练编辑器"
        defaultValue={SEED_VALUE}
        tokenDeletion={mode}
        variant="subtle"
      />
    </div>
  );
};
