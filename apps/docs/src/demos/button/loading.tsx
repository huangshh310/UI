"use client";

/**
 * 示例：加载状态。点击后进入加载中，期间的点击与键盘激活都被忽略。
 */
import { Button } from "@matt-ui/ui";
import { useState } from "react";

export const ButtonLoading = () => {
  const [saving, setSaving] = useState(false);
  const [count, setCount] = useState(0);

  const save = () => {
    setSaving(true);
    setCount((previous) => previous + 1);
    setTimeout(() => setSaving(false), 1600);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Button loading={saving} onClick={save}>
        {saving ? "保存中" : "保存"}
      </Button>
      <p className="font-mono text-xs text-muted-foreground">
        已触发 <span data-testid="save-count">{count}</span> 次
      </p>
    </div>
  );
};
