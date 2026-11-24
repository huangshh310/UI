"use client";

/**
 * 示例：AiSurfaceAgent 在主区域与侧栏组合生成产物画布、知识引用溯源与层级拓扑树。
 */
import { AiSurfaceAgent, type AiSurfaceAgentProps } from "@matt-ui/ui";
import { useState } from "react";

const WORKSPACE_VIEW: NonNullable<AiSurfaceAgentProps["uischema"]> = {
  main: [
    {
      kind: "artifact",
      title: "自适应限流中间件",
      artifactType: "code",
      language: "ts",
      versionLabel: "v2 · 生产候选",
      summary: "基于令牌桶与实时队列水位动态调节并发预算。",
      content: [
        "export interface RatePolicy {",
        "  burst: number;",
        "  sustainedRps: number;",
        "}",
        "",
        "export const defaultPolicy: RatePolicy = { burst: 240, sustainedRps: 120 };",
      ].join("\n"),
    },
    {
      kind: "citation",
      index: 1,
      title: "边缘流量治理技术规范",
      domain: "handbook.internal",
      snippet: "突发容量建议配置为稳态吞吐量的 2 倍，以吸收瞬时重连毛刺。",
    },
  ],
  dock: {
    kind: "tree",
    title: "关联服务模块",
    defaultExpandedIds: ["gateway"],
    selectActionId: "select-module",
    items: [
      {
        id: "gateway",
        label: "gateway-core",
        children: [
          { id: "limiter.ts", label: "limiter.ts", badge: "已更新" },
          { id: "metrics.ts", label: "metrics.ts" },
        ],
      },
      { id: "shared-types", label: "shared-types" },
    ],
  },
};

export const AiSurfaceAgentKnowledge = () => {
  const [selected, setSelected] = useState<string>("limiter.ts");

  return (
    <div className="flex w-full flex-col gap-2.5">
      <AiSurfaceAgent
        uischema={WORKSPACE_VIEW}
        onAction={(ev) => {
          if (ev.payload?.selectedId) setSelected(String(ev.payload.selectedId));
        }}
      />
      <p className="m-0 font-mono text-xs text-muted-foreground">{`当前聚焦模块：${selected}`}</p>
    </div>
  );
};

export default AiSurfaceAgentKnowledge;
