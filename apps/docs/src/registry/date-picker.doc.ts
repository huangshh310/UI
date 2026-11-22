/**
 * Date Picker 的文档数据。
 */
import { DatePickerBasic } from "@/demos/date-picker/basic";
import DatePickerRangeDemo from "@/demos/date-picker/range";
import type { ComponentDoc } from "./registry.types";

export const DATE_PICKER_DOC: ComponentDoc = {
  slug: "date-picker",
  name: "Date Picker",
  description:
    "基于 Base UI Popover 与 Calendar 组合的日期与区间选择器，支持左侧快捷预设与一键清空。",
  category: "forms",
  registryName: "date-picker",
  dependencies: ["@base-ui/react", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { DatePicker } from "@/components/ui/date-picker";

export function Demo() {
  return <DatePicker label="发布日期" placeholder="选择日期" />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "date-picker-basic",
      name: "带快捷预设的日期选择",
      description: "点击触发器展开弹性浮层，支持一键预设与清空按钮。",
      file: "date-picker/basic.tsx",
      Demo: DatePickerBasic,
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
      name: "presets",
      type: "DatePickerPreset[]",
      defaultValue: "[]",
      description: "左侧快捷日期预设按钮列表。",
    },
    {
      name: "clearable",
      type: "boolean",
      defaultValue: "true",
      description: "有值时在触发器右侧显示一键清除按钮。",
    },
    {
      name: "label / placeholder",
      type: "string",
      defaultValue: "-",
      description: "字段标签与未选择时的占位说明。",
    },
  ],
  accessibility: [
    "弹层开关、碰撞翻转、Escape 关闭与关闭后焦点恢复由 Base UI Popover 统一管理。",
    "清除按钮独立于触发按钮之外，避免嵌套交互元素违反 HTML 规范。",
    "通过 Registry 安装时自动把 calendar 登记为组件依赖。",
  ],
};
