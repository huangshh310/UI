"use client";

import { StretchSwitch } from "@matt-ui/motion";
import { useState } from "react";

export default function StretchSwitchSettingsDemo() {
  const [preview, setPreview] = useState(true);
  const [telemetry, setTelemetry] = useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 rounded-xl border border-solid border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-medium text-foreground">自动部署 PR 预览环境</p>
          <p className="m-0 text-[11px] text-muted-foreground">每次推送分支自动生成临时链接</p>
        </div>
        <StretchSwitch
          aria-label="自动部署 PR 预览环境"
          checked={preview}
          onCheckedChange={setPreview}
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-solid border-border/75 pt-3">
        <div>
          <p className="m-0 text-xs font-medium text-foreground">匿名性能遥测</p>
          <p className="m-0 text-[11px] text-muted-foreground">仅上报组件构建耗时摘要</p>
        </div>
        <StretchSwitch
          aria-label="匿名性能遥测"
          checked={telemetry}
          onCheckedChange={setTelemetry}
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-solid border-border/75 pt-3 opacity-60">
        <p className="m-0 text-xs font-medium text-foreground">强制 HTTPS（组织策略锁定）</p>
        <StretchSwitch aria-label="强制 HTTPS" checked disabled />
      </div>
    </div>
  );
}
