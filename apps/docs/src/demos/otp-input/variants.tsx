"use client";

/**
 * 示例：四种视觉风格（default / grouped / filled / underline）与三档尺寸。
 */
import { OtpInput } from "@matt-ui/motion";

export default function OtpInputVariantsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <OtpInput
        label="独立描边（Default）"
        variant="default"
        length={6}
        separatorAt={3}
        defaultValue="482"
      />
      <OtpInput
        label="shadcn 连体分组（Grouped）"
        variant="grouped"
        length={6}
        separatorAt={3}
        defaultValue="910"
      />
      <OtpInput
        label="柔灰填充（Filled · Lg）"
        variant="filled"
        size="lg"
        length={4}
        defaultValue="24"
      />
      <OtpInput
        label="极简下划线（Underline · Sm）"
        variant="underline"
        size="sm"
        length={6}
        defaultValue="731"
      />
    </div>
  );
}
