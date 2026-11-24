/**
 * SplitButton 的文档数据。
 */
import { SplitButtonBasic } from "@/demos/split-button/basic";
import SplitButtonReleaseDemo from "@/demos/split-button/release";
import SplitButtonVariantsDemo from "@/demos/split-button/variants";
import type { ComponentDoc } from "./registry.types";

export const SPLIT_BUTTON_DOC: ComponentDoc = {
  slug: "split-button",
  name: "Split Button",
  description: "一个主操作，加上一个打开相关操作菜单的箭头按钮，两者共用一个整体轮廓。",
  category: "buttons",
  registryName: "split-button",
  dependencies: [
    "@base-ui/react",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  usage: `import { SplitButton } from "@/components/ui/split-button";

export function Demo() {
  return (
    <SplitButton
      variant="signal"
      onClick={() => console.log("save")}
      actions={[
        { id: "draft", label: "保存为草稿", shortcut: "⌘S", onSelect: () => console.log("draft") },
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
    {
      slug: "release",
      name: "信号色发布分体按钮",
      description: "主按钮直接发布生产环境，毛玻璃下拉菜单支持图标、说明、快捷键与高危操作项。",
      file: "split-button/release.tsx",
      Demo: SplitButtonReleaseDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "多变体与圆角形态",
      description: "覆盖 primary、outline、secondary、destructive 变体以及标准圆角与紧凑尺寸。",
      file: "split-button/variants.tsx",
      Demo: SplitButtonVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "actions",
      type: "SplitButtonAction[]",
      defaultValue: "-",
      description:
        "菜单中的操作，每项包含 id、label、onSelect，可选 icon、description、shortcut、destructive、disabled。",
    },
    {
      name: "variant",
      type: '"primary" | "signal" | "secondary" | "outline" | "destructive"',
      defaultValue: '"primary"',
      description: "视觉变体。",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "按钮尺寸。",
    },
    {
      name: "radius",
      type: '"pill" | "default"',
      defaultValue: '"pill"',
      description: "圆角风格：胶囊圆角或标准圆角。",
    },
    {
      name: "loading",
      type: "boolean",
      defaultValue: "false",
      description: "主操作处于加载中时显示旋转指示器并阻止重复触发。",
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
    "下拉菜单内置完整的方向键导航、焦点锁定与关闭后焦点恢复。",
    "主操作与箭头按钮各自可以聚焦；菜单关闭后焦点回到箭头按钮。",
    "箭头按钮没有可见文字，通过 menuLabel 提供名称。",
  ],
};
