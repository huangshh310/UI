import PeekCardBasicDemo from "@/demos/peek-card/basic";
import PeekCardReleaseDemo from "@/demos/peek-card/release";
import type { ComponentDoc } from "./registry.types";

export const PEEK_CARD_DOC: ComponentDoc = {
  slug: "peek-card",
  name: "Peek Card",
  description: "悬停或聚焦链接时浮现的富内容预览卡片，适合订单、用户与文档快览。",
  category: "overlays",
  registryName: "peek-card",
  dependencies: ["@base-ui/react"],
  usage: `import { PeekCard } from "@/components/ui/peek-card";

<PeekCard triggerLabel="ORD-089" title="ORD-089" value="¥1,290.00" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "交易摘要预览",
      description: "包含顶部金额、内嵌身份信息卡、等宽键值指标与底部状态点。",
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
  ],
  api: [
    {
      name: "triggerLabel",
      type: "string",
      defaultValue: '"查看预览"',
      description: "默认触发链接文案",
    },
    { name: "title", type: "string", defaultValue: "必填", description: "卡片标题" },
    { name: "identity", type: "PeekCardIdentity", defaultValue: "—", description: "内嵌身份区块" },
    { name: "metrics", type: "PeekCardMetric[]", defaultValue: "—", description: "键值对等宽指标" },
  ],
  accessibility: ["基于 Base UI PreviewCard，保留原生链接语义，支持悬停防抖与键盘聚焦预览。"],
};
