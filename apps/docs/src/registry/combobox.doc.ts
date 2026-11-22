/**
 * Combobox 的文档数据。
 */
import { ComboboxBasic } from "@/demos/combobox/basic";
import ComboboxAssigneeDemo from "@/demos/combobox/assignee";
import type { ComponentDoc } from "./registry.types";

export const COMBOBOX_DOC: ComponentDoc = {
  slug: "combobox",
  name: "Combobox",
  description:
    "基于 Base UI Combobox 的可搜索组合选择器，支持实时过滤、信号色下划线命中高亮与一键清空。",
  category: "forms",
  registryName: "combobox",
  dependencies: ["@base-ui/react", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { Combobox } from "@/components/ui/combobox";

export function Demo() {
  return (
    <Combobox
      label="技术栈"
      options={[
        { value: "next", label: "Next.js" },
        { value: "vite", label: "Vite" },
      ]}
    />
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "combobox-basic",
      name: "搜索过滤与命中高亮",
      description: "输入关键字实时过滤并下划线标注命中子串，支持空状态与一键清空。",
      file: "combobox/basic.tsx",
      Demo: ComboboxBasic,
    },
    {
      slug: "assignee",
      name: "成员指派可搜索下拉",
      description: "支持输入中文姓名或角色关键词实时过滤并快速指派负责人。",
      file: "combobox/assignee.tsx",
      Demo: ComboboxAssigneeDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "options",
      type: "ComboboxOption[]",
      defaultValue: "-",
      description: "候选项列表（必填）。",
    },
    { name: "label", type: "string", defaultValue: "-", description: "输入框标签。" },
    {
      name: "placeholder",
      type: "string",
      defaultValue: `"输入关键词搜索…"`,
      description: "占位提示。",
    },
    {
      name: "emptyText",
      type: "string",
      defaultValue: `"没有匹配项"`,
      description: "无结果时的空状态文案。",
    },
    {
      name: "value / defaultValue",
      type: "string | null",
      defaultValue: "-",
      description: "受控或非受控选中值。",
    },
    {
      name: "loading",
      type: "boolean",
      defaultValue: "false",
      description: "异步远程检索中的加载提示。",
    },
    { name: "clearable", type: "boolean", defaultValue: "true", description: "是否展示清除按钮。" },
  ],
  accessibility: [
    "输入框保持 combobox 角色，过滤、空状态与选中过程中焦点稳定留在输入框内。",
    "支持方向键高亮与 Enter 确认，清除与展开按钮均具备明确 aria-label。",
    "注（Base UI 已知偏差）：浮层打开时给外部节点加 aria-hidden 但未禁用焦点，E2E 中保留有对应回归监测。",
  ],
};
