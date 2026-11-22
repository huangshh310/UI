"use client";

import { Button, EmptyState } from "@matt-ui/ui";
import { FolderPlus } from "lucide-react";

export default function EmptyStateProjectDemo() {
  return (
    <div className="w-full max-w-md">
      <EmptyState
        icon={<FolderPlus className="size-5" />}
        title="尚未创建私有组件仓"
        description="连接你的 Git 仓库或运行初始化向导，一键发布内部团队专属 Registry。"
        action={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="signal">
              新建组件仓
            </Button>
            <Button size="sm" variant="outline">
              查看接入指南
            </Button>
          </div>
        }
      />
    </div>
  );
}
