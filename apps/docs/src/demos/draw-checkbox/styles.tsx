"use client";

/**
 * 示例：形状、尺寸、语义色与协议错误校验。
 */
import { DrawCheckbox } from "@matt-ui/ui";
import { useState } from "react";

export const DrawCheckboxStyles = () => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
        <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          形状与尺寸
        </p>
        <DrawCheckbox size="sm" shape="square" label="利落方角 · sm" defaultChecked />
        <DrawCheckbox size="md" shape="rounded" label="柔润圆角 · md" defaultChecked />
        <DrawCheckbox size="lg" shape="circle" tone="signal" label="全圆触控 · lg" defaultChecked />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
        <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          语义色、禁用与校验
        </p>
        <DrawCheckbox
          tone="destructive"
          label="永久删除所有历史快照"
          description="操作不可撤销，请再次确认。"
          defaultChecked
        />
        <DrawCheckbox label="企业统一策略（不可更改）" disabled defaultChecked />
        <DrawCheckbox
          label="我已阅读并同意服务条款"
          checked={accepted}
          onCheckedChange={setAccepted}
          error={accepted ? undefined : "请先勾选同意服务条款后再继续。"}
        />
      </div>
    </div>
  );
};
