"use client";

/**
 * 示例：StretchSwitch 的按压拉伸与弹簧回弹开关。
 */
import { StretchSwitch } from "@matt-ui/motion";
import { useState } from "react";

export const StretchSwitchBasic = () => {
  const [autoDeploy, setAutoDeploy] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <StretchSwitch
        label="合并后自动部署预览"
        description="按住滑块感受拉伸，松手回弹到位。"
        checked={autoDeploy}
        onCheckedChange={setAutoDeploy}
      />
      <StretchSwitch label="信号色焦点模式" tone="signal" defaultChecked />
    </div>
  );
};
