"use client";

import { CommandMenu } from "@matt-ui/ui";
import { BookOpen, Palette, Sparkles } from "lucide-react";
import { useState } from "react";

export default function CommandMenuBasicDemo() {
  const [last, setLast] = useState("点击上方按钮体验子页面栈");

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-2.5">
      <CommandMenu
        triggerLabel="打开命令面板…"
        onSelect={(id) => setLast(`已执行：${id}`)}
        groups={[
          {
            heading: "快速跳转",
            items: [
              {
                id: "docs",
                label: "查看快速开始",
                keywords: ["guide", "docs"],
                icon: <BookOpen className="size-3.5" />,
                shortcut: "G D",
              },
              {
                id: "tokens",
                label: "浏览设计 Token",
                keywords: ["color", "cobalt"],
                icon: <Palette className="size-3.5" />,
              },
            ],
          },
          {
            heading: "偏好设置",
            items: [
              {
                id: "theme",
                label: "切换主题配色",
                icon: <Sparkles className="size-3.5" />,
                subPage: {
                  heading: "选择主题",
                  items: [
                    { id: "theme-light", label: "纯净浅色" },
                    { id: "theme-dark", label: "曜石深色" },
                    { id: "theme-system", label: "跟随系统" },
                  ],
                },
              },
            ],
          },
        ]}
      />
      <span className="font-mono text-xs text-muted-foreground">{last}</span>
    </div>
  );
}
