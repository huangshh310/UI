"use client";

import { Separator } from "@matt-ui/ui";

export default function SeparatorBasicDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex h-5 items-center gap-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Token</span>
        <Separator orientation="vertical" />
        <span>Registry</span>
        <Separator orientation="vertical" />
        <span>Storybook</span>
      </div>
      <Separator label="或使用工作区密钥" />
    </div>
  );
}
