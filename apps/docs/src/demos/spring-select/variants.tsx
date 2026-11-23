"use client";

/**
 * 示例：四种视觉风格（default / filled / elevated / ghost）与圆角、尺寸组合。
 */
import { SpringSelect } from "@matt-ui/ui";
import { Palette, SlidersHorizontal, Sparkles, Sun } from "lucide-react";

const THEMES = [
  { value: "system", label: "跟随系统", badge: "Auto", icon: <Sun className="size-3.5" /> },
  { value: "light", label: "极净浅色", badge: "Light", icon: <Palette className="size-3.5" /> },
  { value: "dark", label: "深曜石黑", badge: "Dark", icon: <Sparkles className="size-3.5" /> },
];

const SORTS = [
  { value: "popular", label: "综合推荐" },
  { value: "newest", label: "最新发布" },
  { value: "stars", label: "收藏最多" },
];

export default function SpringSelectVariantsDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
      <SpringSelect
        label="标准描边（Default）"
        variant="default"
        radius="md"
        defaultValue="system"
        options={THEMES}
        className="max-w-none"
      />
      <SpringSelect
        label="柔灰胶囊（Filled + Pill）"
        variant="filled"
        radius="pill"
        tone="signal"
        defaultValue="light"
        options={THEMES}
        className="max-w-none"
      />
      <SpringSelect
        label="浮雕卡片（Elevated + Lg）"
        variant="elevated"
        size="lg"
        radius="lg"
        tone="signal"
        defaultValue="dark"
        options={THEMES}
        className="max-w-none"
      />
      <SpringSelect
        label="工具栏幽灵（Ghost + Sm）"
        variant="ghost"
        size="sm"
        radius="pill"
        prefix={<SlidersHorizontal className="size-3.5" />}
        defaultValue="popular"
        options={SORTS}
        className="max-w-none"
      />
    </div>
  );
}
