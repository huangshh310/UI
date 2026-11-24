"use client";

/**
 * 示例：AgentScreen 智能体实时操作屏幕视口（连接中 / 运行中切换）。
 */
import { AgentScreen, type AgentScreenStatus } from "@matt-ui/ui";
import { useState } from "react";

export default function AgentScreenBasicDemo() {
  const [status, setStatus] = useState<AgentScreenStatus>("working");

  return (
    <div className="w-full max-w-lg">
      <AgentScreen
        status={status}
        title="智能体屏幕"
        loadingLabel="正在连接智能体屏幕"
        activityLabel="正在核对季度库存报表"
        onStatusChange={setStatus}
      >
        <div className="flex size-full flex-col justify-between bg-[#111113] p-5 text-neutral-200">
          <div className="flex items-center justify-end gap-1.5">
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
          </div>
          <div className="space-y-2.5">
            <div className="h-2.5 w-28 rounded-full bg-white/15" />
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-solid border-white/10 bg-white/[0.04] p-2.5">
                <div className="text-[10px] text-neutral-400">本月销量</div>
                <div className="mt-1 font-mono text-sm font-medium text-white tabular-nums">
                  +23.4%
                </div>
              </div>
              <div className="rounded-lg border border-solid border-white/10 bg-white/[0.04] p-2.5">
                <div className="text-[10px] text-neutral-400">毛利率</div>
                <div className="mt-1 font-mono text-sm font-medium text-white tabular-nums">
                  68.2%
                </div>
              </div>
              <div className="rounded-lg border border-solid border-white/10 bg-white/[0.04] p-2.5">
                <div className="text-[10px] text-neutral-400">待补货 SKU</div>
                <div className="mt-1 font-mono text-sm font-medium text-white tabular-nums">
                  3 项
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-solid border-white/10 pt-2.5 font-mono text-[10px] text-neutral-400">
            <span>sandbox://workspace/inventory</span>
            <span>60 FPS · Read-only</span>
          </div>
        </div>
      </AgentScreen>
    </div>
  );
}
