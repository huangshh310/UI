"use client";

import { Alert, Button } from "@matt-ui/ui";
import { useState } from "react";

export default function AlertActionableDemo() {
  const [upgraded, setUpgraded] = useState(false);

  return (
    <div className="w-full max-w-xl">
      <Alert
        variant={upgraded ? "success" : "warning"}
        title={upgraded ? "已开启自动弹性配额" : "本月边缘分发流量已达 85%"}
        description={
          upgraded
            ? "超出部分将按需无缝扩容，不再触发限流。"
            : "建议升级至专业版或开启弹性配额，避免高峰时段构建延迟。"
        }
        action={
          !upgraded ? (
            <Button size="sm" variant="signal" onClick={() => setUpgraded(true)}>
              立即开启
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
