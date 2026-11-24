/**
 * Combobox 的文档数据。
 */
import ComboboxAssigneeDemo from "@/demos/combobox/assignee";
import { ComboboxBasic } from "@/demos/combobox/basic";
import ComboboxMultiDemo from "@/demos/combobox/multi";
import ComboboxVariantsDemo from "@/demos/combobox/variants";
import type { ComponentDoc } from "./registry.types";

export const COMBOBOX_DOC: ComponentDoc = {
  slug: "combobox",
  name: "Combobox",
  description:
    "极简可搜索组合选择器，支持单选与多选可移除芯片（multiple）、实时过滤、命中高亮、异步加载与校验反馈。",
  category: "forms",
  registryName: "combobox",
  dependencies: [
    "@base-ui/react",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  usage: `import { Combobox } from "@/components/ui/combobox";

export function Demo() {
  return (
    <Combobox
      multiple
      label="技术栈"
      showSearchIcon
      options={[
        { value: "next", label: "Next.js", badge: "v16" },
        { value: "vite", label: "Vite", badge: "v7" },
      ]}
    />
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "combobox-basic",
      name: "搜索过滤与命中高亮",
      description: "输入关键字实时过滤并高亮标注命中子串，支持空状态与一键清空。",
      file: "combobox/basic.tsx",
      Demo: ComboboxBasic,
    },
    {
      slug: "multi",
      name: "多选可移除芯片搜索器",
      description: "传入 multiple 开启原生 Chips 多选模式，支持边搜边加、点击芯片 × 或退格删除。",
      file: "combobox/multi.tsx",
      Demo: ComboboxMultiDemo,
      directory: false,
    },
    {
      slug: "assignee",
      name: "成员指派可搜索下拉",
      description: "支持中文姓名过滤，结合在线状态圆点与角色信息快速指派负责人。",
      file: "combobox/assignee.tsx",
      Demo: ComboboxAssigneeDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "视觉变体、加载与校验态",
      description: "展示 filled 填充风、异步 loading 检索与 error 校验态。",
      file: "combobox/variants.tsx",
      Demo: ComboboxVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "options",
      type: "ComboboxOption[]",
      defaultValue: "-",
      description: "候选项列表（必填），支持 description、icon、badge、dot 与 disabled。",
    },
    {
      name: "multiple",
      type: "boolean",
      defaultValue: "false",
      description: "开启多选可移除芯片模式，value 自动切换为 string[]。",
    },
    {
      name: "variant / size / radius",
      type: `"default" | "filled" | "elevated" / "sm" | "md" | "lg" / "md" | "lg" | "pill"`,
      defaultValue: `"default" / "md" / "md"`,
      description: "输入框视觉风格、高度尺寸与圆角。",
    },
    {
      name: "prefix / showSearchIcon",
      type: "ReactNode / boolean",
      defaultValue: "- / false",
      description: "自定义前置图标，或一键显示搜索放大镜图标。",
    },
    {
      name: "label / hint / error",
      type: "string",
      defaultValue: "-",
      description: "标签、辅助说明与错误校验提示（传入 error 自动设置 aria-invalid）。",
    },
    {
      name: "emptyText / loading / clearable",
      type: "string / boolean / boolean",
      defaultValue: `"没有匹配项" / false / true`,
      description: "无结果提示、异步加载指示与一键清除按钮。",
    },
    {
      name: "value / defaultValue / onValueChange",
      type: "string | null 或 string[]",
      defaultValue: "-",
      description: "受控或非受控选中值及变更回调，随 multiple 自动推导类型。",
    },
  ],
  accessibility: [
    "输入框保持 combobox 角色，过滤、空状态与选中过程中焦点稳定留在输入框内。",
    "多选模式下每个芯片的移除按钮均带独立无障碍标签，同时支持 Backspace 键盘快捷移除。",
    "浮层打开与关闭期间持续通过端到端无障碍焦点审计监控。",
  ],
};
