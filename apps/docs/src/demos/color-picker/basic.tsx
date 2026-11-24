"use client";

/**
 * 示例：ColorPicker 二维色盘、色相滑轨、色值输入与预设色板实时选色预览。
 */
import { ColorPicker } from "@matt-ui/ui";
import { useState } from "react";

const BRAND_PRESETS = [
  "#2563eb",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#0f172a",
];

export const ColorPickerBasic = () => {
  const [color, setColor] = useState("#2563eb");

  return (
    <div className="flex flex-col items-center gap-3">
      <ColorPicker
        label="品牌主题信号色"
        value={color}
        onValueChange={setColor}
        presets={BRAND_PRESETS}
      />
      <p
        data-testid="color-picker-output"
        className="m-0 font-mono text-xs text-muted-foreground tabular-nums"
      >
        当前色值：{color}
      </p>
    </div>
  );
};
