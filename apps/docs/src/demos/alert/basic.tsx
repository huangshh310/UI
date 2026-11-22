"use client";

import { Alert, Button } from "@matt-ui/ui";

export default function AlertBasicDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2.5">
      <Alert
        variant="info"
        title="Token 对比度校验已通过"
        description="全部语义表面均满足 WCAG AA 4.5:1 对比度基线。"
      />
      <Alert
        variant="warning"
        title="发现 1 个待更新的锁版本依赖"
        description="请在升级前运行全量无障碍回归测试。"
        action={
          <Button size="sm" variant="outline">
            查看详情
          </Button>
        }
        dismissible
      />
    </div>
  );
}
