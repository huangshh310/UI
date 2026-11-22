import AvatarStackBasicDemo from "@/demos/avatar-stack/basic";
import AvatarStackSizesDemo from "@/demos/avatar-stack/sizes";
import type { ComponentDoc } from "./registry.types";

export const AVATAR_STACK_DOC: ComponentDoc = {
  slug: "avatar-stack",
  name: "Avatar Stack",
  description: "叠放头像组，支持图片首字母回退、状态圆点、悬停浮出提示与 +N 溢出折叠。",
  category: "overlays",
  registryName: "avatar-stack",
  dependencies: ["@base-ui/react"],
  usage: `import { AvatarStack } from "@/components/ui/avatar-stack";

<AvatarStack items={members} max={4} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "成员叠放与溢出提示",
      description: "复用 DirectionalTooltip 展示成员姓名与角色，超出 max 自动折叠为 +N。",
      file: "avatar-stack/basic.tsx",
      Demo: AvatarStackBasicDemo,
    },
    {
      slug: "sizes",
      name: "尺寸规格对比（sm / md / lg）",
      description: "在同一页面直观对比三种头像尺寸与不同 max 溢出阈值效果。",
      file: "avatar-stack/sizes.tsx",
      Demo: AvatarStackSizesDemo,
      directory: false,
    },
  ],
  api: [
    { name: "items", type: "AvatarStackItem[]", defaultValue: "必填", description: "成员列表" },
    { name: "max", type: "number", defaultValue: "4", description: "最多展示的头像数量" },
    { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "头像尺寸" },
  ],
  accessibility: ["每个头像均是可聚焦按钮并带有成员姓名 aria-label，键盘聚焦即可呼出角色提示。"],
};
