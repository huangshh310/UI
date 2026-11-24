"use client";

/**
 * 示例：Waterfall 通过 range 属性缩放局部时间轴窗口，定位高延迟子步骤。
 */
import { Waterfall, type WaterfallSpan } from "@matt-ui/ui";
import { useState } from "react";

const PIPELINE_SPANS: WaterfallSpan[] = [
  { value: "gateway", label: "边缘鉴权校验", start: 0, duration: 95, tone: "success", meta: "200" },
  {
    value: "context",
    label: "会话记忆装载",
    start: 100,
    duration: 240,
    tone: "default",
    meta: "缓存",
  },
  {
    value: "sandbox",
    label: "沙箱脚本执行",
    start: 350,
    duration: 510,
    tone: "warning",
    meta: "CPU",
  },
  {
    value: "render",
    label: "语义卡片装配",
    start: 870,
    duration: 290,
    tone: "signal",
    meta: "完成",
  },
];

const WINDOWS: { label: string; range: [number, number] }[] = [
  { label: "全链路 (0–1160ms)", range: [0, 1160] },
  { label: "前置阶段 (0–400ms)", range: [0, 400] },
  { label: "沙箱热点 (300–900ms)", range: [300, 900] },
];

export const WaterfallZoomWindow = () => {
  const [windowRange, setWindowRange] = useState<[number, number]>([0, 1160]);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {WINDOWS.map((win) => {
          const active = win.range[0] === windowRange[0] && win.range[1] === windowRange[1];
          return (
            <button
              key={win.label}
              type="button"
              onClick={() => setWindowRange(win.range)}
              className={
                active
                  ? "cursor-pointer rounded-lg border border-solid border-signal bg-signal/12 px-2.5 py-1 font-sans text-xs font-medium text-foreground"
                  : "cursor-pointer rounded-lg border border-solid border-border bg-background px-2.5 py-1 font-sans text-xs text-muted-foreground hover:text-foreground"
              }
            >
              {win.label}
            </button>
          );
        })}
      </div>
      <Waterfall
        ariaLabel="流水线局部缩放追踪"
        metaHeader="状态"
        items={PIPELINE_SPANS}
        range={windowRange}
      />
    </div>
  );
};
