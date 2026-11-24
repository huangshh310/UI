"use client";

/**
 * 示例：通过 rankWith 优先级匹配器注入业务专属控件与自定义扩展节点（x-*）。
 */
import {
  AiSurface,
  and,
  isControl,
  isKind,
  rankWith,
  scopeEndsWith,
  scopeToField,
  type SurfaceDataSchema,
  type SurfaceRendererEntry,
  type SurfaceRendererProps,
  type SurfaceView,
} from "@matt-ui/ui";
import { useState } from "react";

const PRIORITY_LEVELS = [
  { value: "p0", label: "P0 紧急阻断", hint: "5 分钟内响应" },
  { value: "p1", label: "P1 核心降级", hint: "30 分钟内响应" },
  { value: "p2", label: "P2 常规巡检", hint: "下一迭代处理" },
] as const;

const PriorityChipControl = ({ node, data, disabled, onValueChange }: SurfaceRendererProps) => {
  if (node.kind !== "control") return null;
  const field = scopeToField(node.scope);
  const current = String(data[field] ?? "p1");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{node.label ?? "故障响应等级"}</span>
        <span className="rounded-md bg-signal px-2 py-0.5 font-mono text-[11px] font-medium text-white">
          业务渲染器 rank 10
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {PRIORITY_LEVELS.map((item) => {
          const active = current === item.value;
          return (
            <button
              key={item.value}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => onValueChange(field, item.value)}
              className={
                active
                  ? "cursor-pointer rounded-xl border border-solid border-signal bg-signal/10 p-2.5 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  : "cursor-pointer rounded-xl border border-solid border-border bg-card p-2.5 text-left transition-colors outline-none hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring"
              }
            >
              <p className="m-0 text-xs font-semibold text-foreground">{item.label}</p>
              <p className="m-0 mt-0.5 text-[11px] text-muted-foreground">{item.hint}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const CustomSloWidget = ({ node }: SurfaceRendererProps) => {
  const target = String(("props" in node && node.props?.slo) ?? "99.95%");
  return (
    <div className="flex items-center justify-between rounded-xl border border-solid border-border bg-muted/35 px-3.5 py-2.5">
      <span className="text-xs font-medium text-foreground">
        服务等级目标（x-slo-meter 扩展节点）
      </span>
      <span className="font-mono text-xs font-semibold text-foreground tabular-nums">{target}</span>
    </div>
  );
};

const CUSTOM_RENDERERS: SurfaceRendererEntry[] = [
  {
    id: "custom-priority-chips",
    tester: rankWith(10, and(isControl, scopeEndsWith("priority"))),
    renderer: PriorityChipControl,
  },
  {
    id: "custom-slo-widget",
    tester: rankWith(10, isKind("x-slo-meter")),
    renderer: CustomSloWidget,
  },
];

const SCHEMA: SurfaceDataSchema = {
  properties: {
    priority: {
      type: "string",
      title: "故障响应等级",
      default: "p1",
      oneOf: [
        { value: "p0", label: "P0 紧急阻断" },
        { value: "p1", label: "P1 核心降级" },
        { value: "p2", label: "P2 常规巡检" },
      ],
    },
  },
};

const VIEW: SurfaceView = {
  main: {
    kind: "card",
    head: { title: "值班告警分派单", description: "同一语义协议按注册表分值动态切换控件形态" },
    children: [
      { kind: "control", scope: "#/properties/priority", label: "故障响应等级" },
      { kind: "x-slo-meter", status: "done", props: { slo: "99.99% 可用性预算" } },
    ],
  },
};

export const AiSurfaceCustomRank = () => {
  const [useCustom, setUseCustom] = useState(true);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {useCustom ? "当前生效：业务高优渲染器 (rank 10)" : "当前生效：内置默认渲染器 + 安全兜底"}
        </span>
        <button
          type="button"
          onClick={() => setUseCustom((prev) => !prev)}
          className="cursor-pointer rounded-lg border border-solid border-border bg-card px-2.5 py-1 font-sans text-xs font-medium text-foreground shadow-xs transition-colors outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset"
        >
          {useCustom ? "切换回默认渲染器" : "启用业务渲染器"}
        </button>
      </div>
      <AiSurface
        schema={SCHEMA}
        uischema={VIEW}
        renderers={useCustom ? CUSTOM_RENDERERS : undefined}
      />
    </div>
  );
};

export default AiSurfaceCustomRank;
