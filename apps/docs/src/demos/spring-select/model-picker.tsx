"use client";

/**
 * 示例：AI 模型分组选择器，带极简线性图标、副标题说明与一键清空。
 */
import { SpringSelect } from "@matt-ui/ui";
import { Brain, Cpu, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

const MODELS = [
  {
    value: "matt-pro",
    label: "Matt Pro 4",
    description: "深度推理、长文档与复杂编码",
    badge: "推荐",
    icon: <Sparkles className="size-3.5" />,
    group: "旗舰推理",
  },
  {
    value: "matt-architect",
    label: "Matt Architect",
    description: "细腻文案与界面架构设计",
    badge: "Pro",
    icon: <Brain className="size-3.5" />,
    group: "旗舰推理",
  },
  {
    value: "matt-flash",
    label: "Matt Flash 3",
    description: "毫秒级响应与高并发问答",
    badge: "极速",
    icon: <Zap className="size-3.5" />,
    group: "轻量高速",
  },
  {
    value: "edge-nano",
    label: "Edge Nano",
    description: "端侧离线摘要与分类",
    badge: "端侧",
    icon: <Cpu className="size-3.5" />,
    group: "轻量高速",
  },
];

export default function SpringSelectModelPickerDemo() {
  const [model, setModel] = useState<string | null>("matt-pro");

  return (
    <div className="w-full max-w-80">
      <SpringSelect
        label="默认对话模型"
        placeholder="选择 AI 引擎"
        variant="elevated"
        size="lg"
        radius="lg"
        tone="signal"
        showSelectedDescription
        clearable
        hint="选中图标与副标题自动回显在触发器中"
        options={MODELS}
        value={model}
        onValueChange={setModel}
        className="max-w-none"
      />
    </div>
  );
}
