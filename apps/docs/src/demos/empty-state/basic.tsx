"use client";

import { Button, EmptyState } from "@matt-ui/ui";
import { FolderOpen } from "lucide-react";

export default function EmptyStateBasicDemo() {
  return (
    <EmptyState
      className="max-w-sm"
      compact
      icon={<FolderOpen className="size-5" />}
      title="还没有上传任何设计稿"
      description="拖拽文件到此区域，或从本地工作区快速导入组件规范。"
      action={
        <Button size="sm" variant="signal">
          立即导入
        </Button>
      }
      secondaryAction={
        <Button size="sm" variant="outline">
          查看模板
        </Button>
      }
    />
  );
}
