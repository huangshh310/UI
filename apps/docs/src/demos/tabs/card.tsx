"use client";

import { Tabs } from "@matt-ui/ui";

export default function TabsCardDemo() {
  return (
    <div className="w-full max-w-md">
      <Tabs
        variant="card"
        defaultValue="npm"
        items={[
          {
            value: "npm",
            label: "npm 包模式",
            content: (
              <p className="m-0 font-mono text-xs text-muted-foreground">
                pnpm add @matt-ui/ui @matt-ui/tokens
              </p>
            ),
          },
          {
            value: "registry",
            label: "Registry 源码",
            content: (
              <p className="m-0 font-mono text-xs text-muted-foreground">
                pnpm dlx shadcn@latest add huangshh310/UI/tabs
              </p>
            ),
          },
        ]}
      />
    </div>
  );
}
