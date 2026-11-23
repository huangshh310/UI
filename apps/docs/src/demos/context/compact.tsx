/**
 * 示例：Context 高水位预警与紧凑工具栏胶囊（sm / subtle / glass）。
 */
import { Context } from "@matt-ui/ui";

export default function ContextCompactDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Context
        size="sm"
        surface="subtle"
        maxTokens={128000}
        segments={[
          { id: "system", label: "系统提示", tokens: 12000, tone: "primary" },
          { id: "history", label: "长对话记录", tokens: 68000, tone: "signal" },
          { id: "tools", label: "工具输出", tokens: 32000, tone: "warning" },
        ]}
        costLabel="~$0.068"
      />
      <Context
        size="sm"
        surface="glass"
        maxTokens={200000}
        compactable={false}
        showCost={false}
        segments={[
          { id: "system", label: "系统提示", tokens: 18000, tone: "primary" },
          { id: "sources", label: "代码库索引", tokens: 42000, tone: "success" },
        ]}
      />
    </div>
  );
}
