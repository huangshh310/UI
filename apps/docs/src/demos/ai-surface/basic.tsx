"use client";

/**
 * 示例：通过 applySurfacePatch 驱动流式增量更新的多区域语义看板。
 */
import { AiSurface, applySurfacePatch, type SurfacePatch, type SurfaceView } from "@matt-ui/ui";
import { useState } from "react";

const BTN_OUTLINE =
  "cursor-pointer rounded-lg bg-card px-3 py-1.5 font-sans text-xs font-medium text-foreground shadow-2xs transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-45";

const BTN_PRIMARY =
  "cursor-pointer rounded-lg bg-primary px-3 py-1.5 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-colors outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-45";

const INITIAL_VIEW: SurfaceView = {
  main: {
    kind: "card",
    key: "rollout",
    head: { title: "边缘网关灰度发布", description: "亚太一区生产集群", status: "running" },
    end: { kind: "badge", key: "phase", label: "阶段 1 / 3", tone: "signal" },
    children: [
      {
        kind: "stats",
        key: "metrics",
        items: [
          { label: "请求成功率", value: "99.94%", tone: "success" },
          { label: "P95 延迟", value: "42ms" },
        ],
      },
      {
        kind: "progress",
        key: "traffic",
        label: "流量切分权重",
        value: 25,
        valueLabel: "25%",
        tone: "signal",
      },
      {
        kind: "table",
        key: "pods",
        columns: [
          { key: "pod", header: "实例节点", cellKind: "mono" },
          { key: "state", header: "健康状态", cellKind: "badge" },
        ],
        rows: [{ pod: "edge-gw-01", state: "Ready" }],
      },
    ],
  },
  dock: {
    kind: "kv",
    key: "env",
    items: [
      { label: "目标版本", value: "v2.8.0", mono: true },
      { label: "守护策略", value: "自动熔断开启" },
    ],
  },
};

const PATCH_STEPS: SurfacePatch[][] = [
  [
    {
      op: "mergeProps",
      targetId: "main.rollout.traffic",
      patch: { value: 65, valueLabel: "65%" },
    },
    {
      op: "appendItems",
      targetId: "main.rollout.pods",
      items: [{ pod: "edge-gw-02", state: "Ready" }],
    },
  ],
  [
    {
      op: "mergeProps",
      targetId: "main.rollout.end",
      patch: { label: "全量就绪", tone: "success" },
    },
    {
      op: "mergeProps",
      targetId: "main.rollout",
      patch: {
        head: { title: "边缘网关灰度发布", description: "全部实例已完成健康检查", status: "done" },
      },
    },
    {
      op: "mergeProps",
      targetId: "main.rollout.traffic",
      patch: { value: 100, valueLabel: "100%", tone: "success" },
    },
    {
      op: "appendItems",
      targetId: "main.rollout.pods",
      items: [{ pod: "edge-gw-03", state: "Ready" }],
    },
  ],
];

export const AiSurfaceBasic = () => {
  const [step, setStep] = useState(0);
  const [view, setView] = useState<SurfaceView>(INITIAL_VIEW);
  const streaming = step < PATCH_STEPS.length;

  const advance = () => {
    const patches = PATCH_STEPS[step];
    if (!patches) return;
    setView((prev) => applySurfacePatch(prev, patches));
    setStep((prev) => prev + 1);
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => {
            setView(INITIAL_VIEW);
            setStep(0);
          }}
          className={BTN_OUTLINE}
        >
          重置初始态
        </button>
        <button type="button" disabled={!streaming} onClick={advance} className={BTN_PRIMARY}>
          {streaming ? "推送下一帧 Patch" : "流式更新已完成"}
        </button>
      </div>
      <AiSurface uischema={view} streaming={streaming} />
    </div>
  );
};

export default AiSurfaceBasic;
