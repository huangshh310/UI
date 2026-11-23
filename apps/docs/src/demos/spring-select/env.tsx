"use client";

/**
 * 示例：受控发布环境选择器，结合极简状态圆点与受控同步。
 */
import { SpringSelect } from "@matt-ui/ui";
import { useState } from "react";

const ENVS = [
  {
    value: "production",
    label: "Production · 生产环境",
    badge: "LIVE",
    dot: "success" as const,
  },
  {
    value: "staging",
    label: "Staging · 预发布环境",
    badge: "QA",
    dot: "warning" as const,
  },
  {
    value: "preview",
    label: "Preview · 预览沙盒",
    badge: "DEV",
    dot: "signal" as const,
  },
];

export default function SpringSelectEnvDemo() {
  const [env, setEnv] = useState("production");

  return (
    <div className="flex w-full max-w-72 flex-col gap-2.5">
      <SpringSelect
        label="发布目标环境"
        tone="signal"
        hint="仅生产环境会触发 CDN 缓存刷新"
        options={ENVS}
        value={env}
        onValueChange={(next) => next && setEnv(next)}
        className="max-w-none"
      />
      <span className="font-mono text-xs text-muted-foreground">目标：{env}</span>
    </div>
  );
}
