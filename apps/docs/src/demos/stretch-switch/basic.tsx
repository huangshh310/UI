"use client";

/**
 * 示例：StretchSwitch 主展示。按住滑块感受弹性拉伸，松手后以弹簧回弹到位。
 */
import { StretchSwitch } from "@matt-ui/motion";
import { useState } from "react";

export const StretchSwitchBasic = () => {
  const [autoDeploy, setAutoDeploy] = useState(true);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <StretchSwitch
        variant="card"
        label="合并后自动部署预览"
        description="按住滑块感受拉伸，松手弹簧回弹到位。"
        checked={autoDeploy}
        onCheckedChange={setAutoDeploy}
      />
      <StretchSwitch
        variant="card"
        tone="signal"
        label="信号色焦点模式"
        description="适合页面中需要唯一品牌强调的主开关。"
        badge="Signal"
        defaultChecked
      />
      <StretchSwitch
        variant="card"
        tone="success"
        label="iOS 翡翠绿触感"
        description="偏 C 端消费级设置面板的柔和反馈。"
        defaultChecked
      />
    </div>
  );
};
