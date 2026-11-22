"use client";

import { MorphingDialog } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";

export default function MorphingDialogReleaseDemo() {
  return (
    <MorphingDialog
      tag="CHANGELOG"
      title="悬浮 Sheet 与 12 区块模板"
      subtitle="点击展开完整更新摘要与升级指南"
      footer={
        <Button size="sm" variant="signal">
          复制升级命令
        </Button>
      }
    >
      <ul className="m-0 flex list-disc flex-col gap-1.5 pl-4 text-xs leading-relaxed text-muted-foreground">
        <li>Sheet 默认升级为四周圆角悬浮留白样式，保留 inset=false 贴边切换能力。</li>
        <li>新增团队权限、账单配额、通知审计流、AI 工作台等 7 套页面区块。</li>
        <li>全量 71 个 Registry 条目通过双主题 axe 对比度审计。</li>
      </ul>
    </MorphingDialog>
  );
}
