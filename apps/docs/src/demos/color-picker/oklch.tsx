"use client";

/**
 * 示例：ColorPicker 在 OKLCH 感知均匀色彩空间下绘制真实色域边界画布，并联动不透明度与通道数值输入。
 */
import { ColorPicker } from "@matt-ui/ui";
import { useState } from "react";

export const ColorPickerOklch = () => {
  const [oklchColor, setOklchColor] = useState("oklch(0.62 0.19 259)");

  return (
    <div className="flex flex-col items-center gap-3">
      <ColorPicker
        label="感知均匀色盘"
        space="oklch"
        value={oklchColor}
        onValueChange={setOklchColor}
        showAlpha
        showChannelInputs
      />
      <p className="m-0 max-w-xs truncate font-mono text-xs text-muted-foreground tabular-nums">
        {oklchColor}
      </p>
    </div>
  );
};
