import PeekCardBasicDemo from "@/demos/peek-card/basic";
import PeekCardProfileDemo from "@/demos/peek-card/profile";
import PeekCardReleaseDemo from "@/demos/peek-card/release";
import type { ComponentDoc } from "./registry.types";

export const PEEK_CARD_DOC: ComponentDoc = {
  slug: "peek-card",
  name: "Peek Card",
  description:
    "悬停或聚焦链接时浮现的磨砂富内容预览卡片，内置身份卡、等宽指标、语义状态点与多档宽度。",
  category: "overlays",
  registryName: "peek-card",
  dependencies: ["@base-ui/react", "class-variance-authority"],
  usage: `import { PeekCard } from "@/components/ui/peek-card";

<PeekCard triggerLabel="ORD-089" title="ORD-089" badge="PAID" value="¥1,290.00" status="已结算" statusTone="success" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "交易摘要预览",
      description: "包含顶部金额、徽章、内嵌身份信息卡、等宽键值指标与语义状态点。",
      file: "peek-card/basic.tsx",
      Demo: PeekCardBasicDemo,
    },
    {
      slug: "release",
      name: "版本发布元信息预览",
      description: "在正文段落中悬停版本号，快速预览构建指标、通过状态与运行环境。",
      file: "peek-card/release.tsx",
      Demo: PeekCardReleaseDemo,
      directory: false,
    },
    {
      slug: "profile",
      name: "协作成员名片预览",
      description: '在正文提及 @成员 时弹出紧凑规格（size="sm"）身份与近期活跃摘要。',
      file: "peek-card/profile.tsx",
      Demo: PeekCardProfileDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "triggerLabel / href",
      type: "string",
      defaultValue: '"查看预览" / "#peek-card"',
      description: "默认触发链接文案与跳转地址",
    },
    {
      name: "title / subtitle / badge",
      type: "string",
      defaultValue: "title 必填",
      description: "卡片主标题、副标题与标题旁徽章",
    },
    { name: "value", type: "string", defaultValue: "—", description: "右上角等宽数值或状态摘要" },
    {
      name: "identity",
      type: "PeekCardIdentity",
      defaultValue: "—",
      description: "内嵌身份区块（支持头像 src 或首字母回退）",
    },
    {
      name: "metrics",
      type: "PeekCardMetric[]",
      defaultValue: "—",
      description: "键值对等宽指标列表",
    },
    {
      name: "status / statusTone",
      type: 'string / "signal" | "success" | "warning" | "destructive" | "muted"',
      defaultValue: '— / "signal"',
      description: "底部状态文案与指示点色调",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "预览卡片宽度规格",
    },
  ],
  accessibility: ["完整保留原生链接语义，同时支持鼠标悬停防抖与键盘聚焦展开预览。"],
};
