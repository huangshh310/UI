"use client";

/**
 * 示例：DrawCheckbox 的路径绘制勾选与半选态。
 */
import { DrawCheckbox } from "@matt-ui/ui";
import { useState } from "react";

export const DrawCheckboxBasic = () => {
  const [agreed, setAgreed] = useState(true);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <DrawCheckbox
        label="发布前自动校验无障碍规则"
        description="在构建阶段检查色彩对比度与焦点可达性。"
        checked={agreed}
        onCheckedChange={setAgreed}
      />
      <DrawCheckbox
        label="同时启用信号色高亮"
        description="关键确认项使用品牌蓝强化视觉焦点。"
        tone="signal"
        defaultChecked
      />
      <DrawCheckbox label="包含部分子模块" indeterminate />
    </div>
  );
};
