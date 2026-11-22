"use client";

import { SpringSelect } from "@matt-ui/ui";
import { useState } from "react";

const ENVS = [
  { value: "production", label: "Production · 生产环境" },
  { value: "staging", label: "Staging · 预发布环境" },
  { value: "preview", label: "Preview · 预览沙盒" },
];

export default function SpringSelectEnvDemo() {
  const [env, setEnv] = useState("production");
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <SpringSelect
        label="发布目标环境"
        options={ENVS}
        value={env}
        onValueChange={(next) => next && setEnv(next)}
      />
      <span className="font-mono text-xs text-muted-foreground">目标：{env}</span>
    </div>
  );
}
