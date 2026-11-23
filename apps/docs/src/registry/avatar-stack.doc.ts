import AvatarStackBasicDemo from "@/demos/avatar-stack/basic";
import AvatarStackInteractiveDemo from "@/demos/avatar-stack/interactive";
import AvatarStackSizesDemo from "@/demos/avatar-stack/sizes";
import type { ComponentDoc } from "./registry.types";

export const AVATAR_STACK_DOC: ComponentDoc = {
  slug: "avatar-stack",
  name: "Avatar Stack",
  description:
    "叠放头像组，支持四档尺寸（xs/sm/md/lg）、四态在线指示点、背景融合描边环、悬停浮出提示与可交互 +N 溢出折叠。",
  category: "overlays",
  registryName: "avatar-stack",
  dependencies: ["@base-ui/react", "class-variance-authority"],
  usage: `import { AvatarStack } from "@/components/ui/avatar-stack";

<AvatarStack items={members} max={4} size="md" ring="card" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "成员叠放与溢出提示",
      description:
        "复用 DirectionalTooltip 展示成员姓名与角色，悬停 +N 徽章可预览被折叠的成员名单。",
      file: "avatar-stack/basic.tsx",
      Demo: AvatarStackBasicDemo,
    },
    {
      slug: "sizes",
      name: "尺寸规格对比（xs / sm / md / lg）",
      description:
        "在同一页面直观对比四种头像尺寸与四态在线圆点（online / away / busy / offline）。",
      file: "avatar-stack/sizes.tsx",
      Demo: AvatarStackSizesDemo,
      directory: false,
    },
    {
      slug: "interactive",
      name: "可点击展开与间距切换",
      description: "结合 onItemClick 与 onOverflowClick 实现点选成员与一键展开全部叠放头像。",
      file: "avatar-stack/interactive.tsx",
      Demo: AvatarStackInteractiveDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "items",
      type: "AvatarStackItem[]",
      defaultValue: "必填",
      description: "成员列表，支持 src、initials、role 与 online / busy / away / offline 状态点",
    },
    {
      name: "max",
      type: "number",
      defaultValue: "4",
      description: "最多展示的头像数量，超出折叠为 +N",
    },
    {
      name: "size / spacing / ring",
      type: '"xs" | "sm" | "md" | "lg" / "tight" | "normal" | "loose" / "card" | "background" | "none"',
      defaultValue: '"md" / "normal" / "card"',
      description: "头像尺寸、叠放紧密度与外圈描边底色",
    },
    {
      name: "interactive / onItemClick / onOverflowClick",
      type: "boolean / (item) => void / () => void",
      defaultValue: "true / — / —",
      description: "悬停浮起交互与头像/溢出计数点击回调",
    },
  ],
  accessibility: [
    "每个头像及 +N 溢出徽章均为可聚焦按钮并带有清晰的中文 aria-label，键盘聚焦即可呼出成员提示。",
  ],
};
