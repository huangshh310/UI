/**
 * Date Picker 的文档数据。
 */
import { DatePickerBasic } from "@/demos/date-picker/basic";
import DatePickerRangeDemo from "@/demos/date-picker/range";
import DatePickerVariantsDemo from "@/demos/date-picker/variants";
import type { ComponentDoc } from "./registry.types";

export const DATE_PICKER_DOC: ComponentDoc = {
  slug: "date-picker",
  name: "Date Picker",
  description:
    "基于 Base UI Popover 与 Calendar 组合的极简日期/区间选择器，内置毛玻璃浮层、左侧快捷预设、视觉变体、校验提示与一键清空。",
  category: "forms",
  registryName: "date-picker",
  dependencies: [
    "@base-ui/react",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  usage: `import { DatePicker } from "@/components/ui/date-picker";

export function Demo() {
  return <DatePicker label="发布日期" variant="default" radius="lg" showTodayButton />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "date-picker-basic",
      name: "带快捷预设的日期选择",
      description: "点击触发器展开毛玻璃弹性浮层，支持一键预设与清空按钮。",
      file: "date-picker/basic.tsx",
      Demo: DatePickerBasic,
    },
    {
      slug: "variants",
      name: "视觉变体与校验反馈",
      description: "展示 filled / elevated 触发器、pill 圆角、回到今天快捷栏与 error 校验态。",
      file: "date-picker/variants.tsx",
      Demo: DatePickerVariantsDemo,
      directory: false,
    },
    {
      slug: "range",
      name: "带快捷预设的区间选择器",
      description: "组合双月区间面板、侧边快捷预设与一键清空按钮，适合迭代排期筛选。",
      file: "date-picker/range.tsx",
      Demo: DatePickerRangeDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "mode",
      type: '"single" | "range"',
      defaultValue: '"single"',
      description: "单日或区间选择模式（区间模式默认双月面板）。",
    },
    {
      name: "variant / size / radius",
      type: '"default" | "filled" | "elevated" / "sm" | "md" | "lg" / "md" | "lg" | "pill"',
      defaultValue: '"default" / "md" / "md"',
      description: "触发器表面风格、高度尺寸与圆角形态。",
    },
    {
      name: "presets",
      type: "DatePickerPreset[]",
      defaultValue: "[]",
      description: "左侧快捷日期预设按钮列表。",
    },
    {
      name: "label / hint / error / placeholder",
      type: "string",
      defaultValue: "-",
      description: "字段标签、辅助说明、错误校验提示（自动设置 aria-invalid）与占位文案。",
    },
    {
      name: "clearable / showTodayButton / calendarRadius",
      type: 'boolean / boolean / "md" | "lg" | "full"',
      defaultValue: 'true / false / "md"',
      description: "触发器一键清空按钮、浮层底部“回到今天”快捷按钮与日历单元格圆角。",
    },
    {
      name: "align / weekStartsOn",
      type: '"start" | "center" | "end" / 0 | 1',
      defaultValue: '"start" / 0',
      description: "弹层水平对齐方式与日历每周起始日。",
    },
  ],
  accessibility: [
    "弹层开关、碰撞翻转、Escape 关闭与关闭后焦点恢复由 Base UI Popover 统一管理。",
    "清除按钮独立于触发按钮之外，避免嵌套交互元素违反 HTML 规范。",
    "传入 error 时自动为触发器附加 aria-invalid 并通过 aria-describedby 关联错误说明。",
  ],
};
