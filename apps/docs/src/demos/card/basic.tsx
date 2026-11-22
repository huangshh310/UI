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

export default function CardBasicDemo() {
  return (
    <Card variant="interactive" className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>边缘计算集群</CardTitle>
          <Badge variant="signal" dot>
            运行中
          </Badge>
        </div>
        <CardDescription>东京与新加坡节点自动健康探活与零停机切换。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            99.98%
          </span>
          <span className="text-xs text-muted-foreground">近 30 天可用率</span>
        </div>
      </CardContent>
      <CardFooter muted>
        <span className="font-mono text-xs text-muted-foreground">P95 · 14ms</span>
        <Button size="sm" variant="outline">
          查看监控
        </Button>
      </CardFooter>
    </Card>
  );
}
