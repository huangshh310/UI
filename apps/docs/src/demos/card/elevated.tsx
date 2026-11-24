"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@matt-ui/ui";

export default function CardElevatedDemo() {
  return (
    <Card variant="elevated" className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>私有 Registry 镜像</CardTitle>
          <Badge variant="signal" dot>
            运行中
          </Badge>
        </div>
        <CardDescription>开启边缘缓存后，团队成员通过 CLI 拉取源码平均仅需 180ms。</CardDescription>
      </CardHeader>
      <CardContent className="text-xs leading-relaxed text-muted-foreground">
        已同步 71 个组件与区块条目，所有版本变更自动触发双主题对比度巡检。
      </CardContent>
      <CardFooter muted>
        <span className="font-mono text-[11px] text-muted-foreground">最近同步：2 分钟前</span>
        <Button size="sm" variant="outline">
          立即同步
        </Button>
      </CardFooter>
    </Card>
  );
}
