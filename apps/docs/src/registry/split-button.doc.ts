/**
 * SplitButton 的文档数据。
 */
import { SplitButtonBasic } from "@/demos/split-button/basic";
import type { ComponentDoc } from "./registry.types";

export const SPLIT_BUTTON_DOC: ComponentDoc = {
  slug: "split-button",
  name: "Split Button",
  description: "一个主操作，加上一个打开相关操作菜单的箭头按钮，两者共用一个胶囊轮廓。",
  category: "buttons",
  registryName: "split-button",
  dependencies: ["@base-ui/react", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { SplitButton } from "@/components/ui/split-button";

export function Demo() {
  return (
    <SplitButton
      onClick={() => console.log("save")}
      actions={[
        { id: "draft", label: "保存为草稿", onSelect: () => console.log("draft") },
        { id: "publish", label: "保存并发布", onSelect: () => console.log("publish") },
      ]}
    >
      保存
    </SplitButton>
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "split-button-basic",
      name: "主操作与菜单",
      description: "主操作直接执行，箭头按钮打开相关操作。",
      file: "split-button/basic.tsx",
      Demo: SplitButtonBasic,
    },
  ],
  api: [
    {
      name: "actions",
      type: "SplitButtonAction[]",
      defaultValue: "-",
      description: "菜单中的操作，每项包含 id、label、onSelect，可选 disabled。",
    },
    {
      name: "onClick",
      type: "() => void",
      defaultValue: "-",
      description: "点击主操作时调用。",
    },
    {
      name: "menuLabel",
      type: "string",
      defaultValue: '"More actions"',
      description: "箭头按钮的可访问名称。",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "禁用整个控件。",
    },
  ],
  accessibility: [
    "菜单的键盘导航、焦点管理与 ARIA 语义由 Base UI 的 Menu 提供。",
    "主操作与箭头按钮各自可以聚焦；菜单关闭后焦点回到箭头按钮。",
    "箭头按钮没有可见文字，通过 menuLabel 提供名称。",
  ],
};
