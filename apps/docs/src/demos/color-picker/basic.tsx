"use client";

/**
 * 示例：ColorPicker 二维色盘、色相滑轨、色值输入与预设色板实时选色预览。
 */
import { ColorPicker } from "@matt-ui/ui";
import { useState } from "react";

const BRAND_PRESETS = [
  "#7a5ee4",
  "#6547d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#0ea5e9",
  "#131418",
];

export const ColorPickerBasic = () => {
  const [color, setColor] = useState("#7a5ee4");

  return (
    <div className="flex flex-col items-center">
      <ColorPicker
        ariaLabel="品牌主题信号色"
        value={color}
        onValueChange={setColor}
        presets={BRAND_PRESETS}
      />
      <output data-testid="color-picker-output" className="sr-only">
        {color}
      </output>
    </div>
  );
};
