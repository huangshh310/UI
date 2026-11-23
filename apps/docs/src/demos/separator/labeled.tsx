"use client";

import { Separator } from "@matt-ui/ui";

export default function SeparatorLabeledDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <Separator label="或使用以下方式登录" />
      <Separator label="高级安全策略" labelAlign="left" />
      <Separator label="可选配置项" labelAlign="right" variant="dashed" />
      <Separator variant="gradient" />
    </div>
  );
}
