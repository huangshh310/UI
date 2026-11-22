/**
 * Spring Select 的文档数据。
 */
import { SpringSelectBasic } from "@/demos/spring-select/basic";
import SpringSelectEnvDemo from "@/demos/spring-select/env";
import type { ComponentDoc } from "./registry.types";

export const SPRING_SELECT_DOC: ComponentDoc = {
  slug: "spring-select",
  name: "Spring Select",
  description: "基于 Base UI Select 的下拉选择器，面板与箭头带克制的弹性过冲展开过渡。",
  category: "forms",
  registryName: "spring-select",
  dependencies: ["@base-ui/react", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { SpringSelect } from "@/components/ui/spring-select";

export function Demo() {
  return (
    <SpringSelect
      label="部署区域"
      options={[
        { value: "tokyo", label: "Tokyo" },
        { value: "singapore", label: "Singapore" },
      ]}
    />
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "spring-select-basic",
      name: "弹性下拉选择",
      description: "支持方向键导航、Home/End、首字母 typeahead、Escape 取消与外部重置。",
      file: "spring-select/basic.tsx",
      Demo: SpringSelectBasic,
    },
    {
      slug: "env",
      name: "受控环境选择器",
      description: "以受控方式绑定发布环境状态，实时同步当前选中值。",
      file: "spring-select/env.tsx",
      Demo: SpringSelectEnvDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "options",
      type: "SpringSelectOption[]",
      defaultValue: "-",
      description: "选项列表（必填）。",
    },
    {
      name: "label",
      type: "string",
      defaultValue: "-",
      description: "选择器标签，自动关联触发器。",
    },
    {
      name: "placeholder",
      type: "string",
      defaultValue: `"请选择…"`,
      description: "未选择时的占位文本。",
    },
    {
      name: "value / defaultValue",
      type: "string | null",
      defaultValue: "-",
      description: "受控或非受控选中值。",
    },
    {
      name: "onValueChange",
      type: "(value: string | null) => void",
      defaultValue: "-",
      description: "选中值变更回调。",
    },
  ],
  accessibility: [
    "触发器具备具名 combobox 语义，浮层为 listbox，支持方向键、Home/End 与字母 typeahead。",
    "选中或按 Escape 关闭后自动把焦点还给触发器。",
    "注（Base UI 已知行为）：键盘打开后选项聚焦滞后约一帧，自动化测试需等待选项获焦后再发导航键。",
  ],
};
