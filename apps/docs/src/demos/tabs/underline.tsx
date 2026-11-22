"use client";

import { Tabs } from "@matt-ui/ui";

export default function TabsUnderlineDemo() {
  return (
    <div className="w-full max-w-md">
      <Tabs
        variant="underline"
        defaultValue="tokens"
        items={[
          {
            value: "tokens",
            label: "Token 规范",
            content: (
              <p className="m-0 text-xs text-muted-foreground">
                使用 --ui-* 语义变量统一管理浅色与深色色板。
              </p>
            ),
          },
          {
            value: "a11y",
            label: "无障碍",
            badge: "AA",
            content: (
              <p className="m-0 text-xs text-muted-foreground">
                所有交互原语均经过键盘焦点、读屏与双主题对比度验证。
              </p>
            ),
          },
          {
            value: "cli",
            label: "CLI 分发",
            content: (
              <p className="m-0 text-xs text-muted-foreground">
                单条 shadcn CLI 命令即可把组件源码直接装进项目。
              </p>
            ),
          },
        ]}
      />
    </div>
  );
}
