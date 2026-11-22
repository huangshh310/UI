"use client";

import { Alert, Button } from "@matt-ui/ui";
import { useState } from "react";

export default function AlertDismissibleDemo() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button size="sm" variant="outline" onClick={() => setVisible(true)}>
        重新显示维护横幅
      </Button>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <Alert
        variant="info"
        title="周日 02:00 UTC 将执行 Registry 边缘证书轮换"
        description="整个切换过程零中断，已缓存的 CLI 源码不受影响。"
        onDismiss={() => setVisible(false)}
      />
    </div>
  );
}
