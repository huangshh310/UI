"use client";

import { Button, EmptyState } from "@matt-ui/ui";
import { CloudUpload, Inbox, Search, Sparkles } from "lucide-react";

export default function EmptyStateVariantsDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <EmptyState
        variant="default"
        icon={<Sparkles className="size-5" />}
        title="Default · 开放画布"
        description="无边框轻盈留白，适合作为页面或标签页的主空白态。"
      />
      <EmptyState
        variant="card"
        icon={<Inbox className="size-5" />}
        title="Card · 实体卡片"
        description="发丝边框与柔影承托，适合独立呈现的引导模块。"
        action={
          <Button size="sm" variant="signal">
            开始创建
          </Button>
        }
      />
      <EmptyState
        variant="dashed"
        icon={<CloudUpload className="size-5" />}
        title="Dashed · 虚线投放区"
        description="拖拽设计稿或 JSON 配置到此区域即可导入。"
      />
      <EmptyState
        variant="compact"
        icon={<Search className="size-4.5" />}
        title="Compact · 紧凑内嵌"
        description="未找到匹配的筛选结果，可尝试更换关键词。"
      />
    </div>
  );
}
