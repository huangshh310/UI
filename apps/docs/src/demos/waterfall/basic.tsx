"use client";

/**
 * 示例：Waterfall 智能体多步调用耗时火焰图，展示嵌套工具追踪、TTFT 里程碑与选中节点详情联动。
 */
import { Waterfall, type WaterfallSpan } from "@matt-ui/ui";
import { useState } from "react";

const TRACE_SPANS: WaterfallSpan[] = [
  {
    value: "turn-root",
    label: "智能体任务主循环",
    start: 0,
    duration: 1180,
    tone: "signal",
    meta: "3.1k tok",
    children: [
      {
        value: "plan-step",
        label: "意图解析与步骤规划",
        start: 12,
        duration: 165,
        tone: "default",
        meta: "420 tok",
      },
      {
        value: "parallel-tools",
        label: "并发工具调度组",
        start: 185,
        duration: 580,
        tone: "default",
        meta: "2 路并发",
        children: [
          {
            value: "vector-search",
            label: "向量文档召回",
            start: 195,
            duration: 210,
            tone: "success",
            meta: "8 命中",
          },
          {
            value: "metrics-query",
            label: "时序聚合查询",
            start: 205,
            duration: 540,
            tone: "warning",
            meta: "重试 1 次",
          },
        ],
      },
      {
        value: "stream-answer",
        label: "结构化视图流式合成",
        start: 775,
        duration: 405,
        tone: "signal",
        meta: "流式",
      },
    ],
  },
];

export const WaterfallBasic = () => {
  const [selected, setSelected] = useState<WaterfallSpan | undefined>(TRACE_SPANS[0]);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2.5">
      <Waterfall
        title="多步工具编排追踪"
        showControls
        metaHeader="负载"
        items={TRACE_SPANS}
        defaultExpanded={["turn-root", "parallel-tools"]}
        milestones={[{ time: 790, label: "首帧 TTFT" }]}
        onValueChange={(_, span) => setSelected(span)}
      />
      <div
        data-testid="waterfall-selected-span"
        className="flex items-center justify-between rounded-xl border border-solid border-border/75 bg-muted/35 px-3 py-2 font-mono text-xs text-muted-foreground"
      >
        <span>当前选中：{selected ? selected.label : "未选中"}</span>
        <span>
          {selected ? `+${selected.start}ms · 耗时 ${selected.duration}ms` : "点击任一行查看详情"}
        </span>
      </div>
    </div>
  );
};
