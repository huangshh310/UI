"use client";

/**
 * 示例：Combobox 的视觉变体（default / filled / elevated）、远程加载态与错误校验态。
 */
import { Combobox } from "@matt-ui/ui";

const MODELS = [
  { value: "matt-pro", label: "Matt Pro 4", badge: "1M" },
  { value: "matt-flash", label: "Matt Flash 3", badge: "极速" },
  { value: "matt-coder", label: "Matt Coder", badge: "编码" },
];

export default function ComboboxVariantsDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
      <Combobox
        label="柔灰填充（Filled）"
        variant="filled"
        radius="lg"
        showSearchIcon
        defaultValue="matt-pro"
        options={MODELS}
        className="max-w-none"
      />
      <Combobox
        label="远程检索加载态"
        showSearchIcon
        loading
        placeholder="输入关键字模拟远程检索…"
        options={MODELS}
        className="max-w-none"
      />
      <Combobox
        label="错误校验态"
        placeholder="必须选择一个模型"
        error="提交配置前请指定默认推理模型"
        options={MODELS}
        className="max-w-none sm:col-span-2"
      />
    </div>
  );
}
