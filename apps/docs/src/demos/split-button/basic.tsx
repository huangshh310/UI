"use client";

/**
 * 示例：SplitButton。主操作直接执行，箭头按钮打开相关操作的菜单。
 */
import { SplitButton } from "@matt-ui/ui";
import { useState } from "react";

export const SplitButtonBasic = () => {
  const [result, setResult] = useState("尚未操作");

  return (
    <div className="flex flex-col items-center gap-3">
      <SplitButton
        onClick={() => setResult("保存")}
        actions={[
          { id: "draft", label: "保存为草稿", onSelect: () => setResult("保存为草稿") },
          { id: "copy", label: "另存为副本", onSelect: () => setResult("另存为副本") },
          { id: "publish", label: "保存并发布", onSelect: () => setResult("保存并发布") },
        ]}
      >
        保存
      </SplitButton>
      <p className="font-mono text-xs text-muted-foreground">
        最近的操作：<span data-testid="split-result">{result}</span>
      </p>
    </div>
  );
};
