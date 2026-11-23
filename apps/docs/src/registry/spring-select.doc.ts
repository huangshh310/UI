/**
 * Spring Select 的文档数据。
 */
import { SpringSelectBasic } from "@/demos/spring-select/basic";
import SpringSelectEnvDemo from "@/demos/spring-select/env";
import SpringSelectModelPickerDemo from "@/demos/spring-select/model-picker";
import SpringSelectMultiDemo from "@/demos/spring-select/multi";
import SpringSelectStatesDemo from "@/demos/spring-select/states";
import SpringSelectVariantsDemo from "@/demos/spring-select/variants";
import type { ComponentDoc } from "./registry.types";

export const SPRING_SELECT_DOC: ComponentDoc = {
  slug: "spring-select",
  name: "Spring Select",
  description:
    "基于 Base UI Select 的极简弹性下拉选择器：轻盈发丝边框与半透明磨砂弹层，支持单选与多选芯片（multiple）、分组菜单、状态圆点、一键清空与校验反馈。",
  category: "forms",
  registryName: "spring-select",
  dependencies: [
    "@base-ui/react",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  usage: `import { SpringSelect } from "@/components/ui/spring-select";

export function Demo() {
  return (
    <SpringSelect
      multiple
      label="技术栈"
      maxTagCount={2}
      clearable
      options={[
        { value: "nextjs", label: "Next.js", badge: "v16" },
        { value: "react", label: "React", badge: "v19" },
        { value: "tailwind", label: "Tailwind CSS", badge: "v4" },
      ]}
    />
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "spring-select-basic",
      name: "弹性下拉选择",
      description: "极简发丝描边与半透明磨砂弹层，支持方向键导航、Home/End、首字母跳转与外部重置。",
      file: "spring-select/basic.tsx",
      Demo: SpringSelectBasic,
    },
    {
      slug: "multi",
      name: "多选与标签芯片",
      description:
        "传入 multiple 开启多选模式，面板内带复选框与底部批量清空，触发器自动折叠超出芯片（+N）。",
      file: "spring-select/multi.tsx",
      Demo: SpringSelectMultiDemo,
      directory: false,
    },
    {
      slug: "model-picker",
      name: "AI 模型分组选择器",
      description: "支持分组标题、线性图标、副标题回显与一键清空。",
      file: "spring-select/model-picker.tsx",
      Demo: SpringSelectModelPickerDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "四种视觉风格与圆角尺寸",
      description: "并排对比 default、filled、elevated、ghost 变体与 pill / lg / sm 组合。",
      file: "spring-select/variants.tsx",
      Demo: SpringSelectVariantsDemo,
      directory: false,
    },
    {
      slug: "env",
      name: "受控环境选择器",
      description: "以受控方式绑定发布环境状态，结合状态圆点与实时目标同步。",
      file: "spring-select/env.tsx",
      Demo: SpringSelectEnvDemo,
      directory: false,
    },
    {
      slug: "states",
      name: "可清空、校验与禁用态",
      description: "展示一键清空（clearable）、错误校验（error + aria-invalid）与禁用锁定态。",
      file: "spring-select/states.tsx",
      Demo: SpringSelectStatesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "options",
      type: "SpringSelectOption[]",
      defaultValue: "-",
      description: "选项列表（必填），支持 icon、description、badge、dot、group 与 disabled。",
    },
    {
      name: "multiple / maxTagCount",
      type: "boolean / number",
      defaultValue: "false / 3",
      description:
        "开启多选模式后 value 变为 string[]，触发器以芯片展示，超出 maxTagCount 折叠为 +N。",
    },
    {
      name: "variant",
      type: '"default" | "filled" | "elevated" | "ghost"',
      defaultValue: '"default"',
      description: "触发器视觉风格：标准描边、柔灰填充、轻浮雕或极简幽灵。",
    },
    {
      name: "size / radius",
      type: '"sm" | "md" | "lg" / "md" | "lg" | "pill"',
      defaultValue: '"md" / "md"',
      description: "触发器高度尺寸与圆角风格（支持胶囊圆角 pill）。",
    },
    {
      name: "tone",
      type: '"default" | "signal"',
      defaultValue: '"default"',
      description: "选中项强调色与勾选图标色调。",
    },
    {
      name: "prefix / showSelectedDescription",
      type: "ReactNode / boolean",
      defaultValue: "- / false",
      description: "未选中时的前置图标，以及单选时是否在触发器内一并显示已选项的说明文案。",
    },
    {
      name: "clearable",
      type: "boolean",
      defaultValue: "false",
      description: "选中值后在触发器右侧显示一键清空按钮（单选重置为 null，多选重置为 []）。",
    },
    {
      name: "popupHeader / popupFooter",
      type: "ReactNode",
      defaultValue: "-",
      description: "下拉弹层顶部的说明栏与底部的提示栏（多选有值时默认展示已选计数与清空）。",
    },
    {
      name: "label / hint / error",
      type: "string",
      defaultValue: "-",
      description: "上方标签、下方辅助提示与错误校验文案（传入 error 自动设置 aria-invalid）。",
    },
    {
      name: "value / defaultValue / onValueChange",
      type: "string | null 或 string[]",
      defaultValue: "-",
      description: "受控或非受控选中值及变更回调，随 multiple 自动推导单选或多选类型。",
    },
  ],
  accessibility: [
    "触发器具备具名 combobox 语义，浮层为 listbox，支持方向键、Home/End 与字母 typeahead。",
    "多选模式由 Base UI 原生管理 aria-multiselectable 与 aria-selected 状态，连续勾选不关闭弹层。",
    "清空按钮独立于触发器之外渲染（无嵌套按钮）；传入 error 时自动设置 aria-invalid 与 alert 提示。",
  ],
};
