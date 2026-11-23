"use client";

import { FolderTabCard } from "@matt-ui/motion";
import { Layers, ShieldCheck, Sparkles } from "lucide-react";

export default function FolderTabCardReleasesDemo() {
  return (
    <div className="w-full max-w-md">
      <FolderTabCard
        variant="tinted"
        tabs={[
          {
            id: "v2",
            label: "悬浮 Sheet",
            icon: <Sparkles />,
            badge: "NEW",
            metric: "v2.4",
            caption: "四周圆角与留白",
            content: (
              <p className="m-0 text-xs leading-relaxed text-muted-foreground">
                Sheet 默认升级为四周圆角悬浮留白样式，支持四方向滑入与 inset=false 贴边切换。
              </p>
            ),
          },
          {
            id: "blocks",
            label: "页面区块",
            icon: <Layers />,
            badge: "12",
            metric: "12",
            caption: "registry:block",
            content: (
              <p className="m-0 text-xs leading-relaxed text-muted-foreground">
                覆盖登录认证、三档定价、控制台、团队权限、账单配额、动态流、AI 工作台与引导向导。
              </p>
            ),
          },
          {
            id: "a11y",
            label: "无障碍门禁",
            icon: <ShieldCheck />,
            metric: "0 违规",
            caption: "WCAG AA",
            content: (
              <p className="m-0 text-xs leading-relaxed text-muted-foreground">
                全量 Registry 安装测试与 Playwright 双主题 axe 审计保持零违规。
              </p>
            ),
          },
        ]}
      />
    </div>
  );
}
