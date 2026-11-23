import HeroBentoBlockBasicDemo from "@/demos/hero-bento-block/basic";
import HeroBentoBlockCenteredDemo from "@/demos/hero-bento-block/centered";
import HeroBentoBlockEnterpriseDemo from "@/demos/hero-bento-block/enterprise";
import type { ComponentDoc } from "./registry.types";

export const HERO_BENTO_BLOCK_DOC: ComponentDoc = {
  slug: "hero-bento-block",
  name: "Hero Bento Block",
  description:
    "由 Badge、Button、AvatarStack、SpotlightCard 与 Progress 组合的落地页首屏与 Bento 特性网格区块，支持左对齐/居中对齐与品牌蓝聚光变体。",
  category: "blocks",
  registryName: "hero-bento-block",
  dependencies: ["@base-ui/react", "class-variance-authority", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { HeroBentoBlock } from "@/components/ui/hero-bento-block";

export function Example() {
  return <HeroBentoBlock variant="spotlight" align="center" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "产品首屏与指针高光 Bento 特性网格",
      description: "纯 CSS 指针径向高光 SpotlightCard 配合指标进度与双 CTA，零 motion 运行时开销。",
      file: "hero-bento-block/basic.tsx",
      Demo: HeroBentoBlockBasicDemo,
    },
    {
      slug: "enterprise",
      name: "企业级设计平台品牌首屏",
      description: "通过 announcement、headline 与 subheadline 定制面向多团队的产品主张。",
      file: "hero-bento-block/enterprise.tsx",
      Demo: HeroBentoBlockEnterpriseDemo,
      directory: false,
    },
    {
      slug: "centered",
      name: "居中聚焦营销首屏与品牌蓝高光",
      description:
        '组合 align="center" 与 variant="spotlight" 呈现经典居中营销首屏与品牌蓝 Bento 特性卡。',
      file: "hero-bento-block/centered.tsx",
      Demo: HeroBentoBlockCenteredDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "announcement",
      type: "string",
      defaultValue: "内置文案",
      description: "顶部公告徽章内容",
    },
    { name: "headline", type: "string", defaultValue: "内置主标题", description: "首屏核心标题" },
    {
      name: "subheadline",
      type: "string",
      defaultValue: "内置副标题",
      description: "首屏价值描述",
    },
    {
      name: "variant",
      type: '"default" | "spotlight" | "minimal"',
      defaultValue: '"default"',
      description: "容器与 Bento 卡片的视觉聚光风格",
    },
    {
      name: "align",
      type: '"start" | "center"',
      defaultValue: '"start"',
      description: "首屏标题与操作区的对齐方式",
    },
    {
      name: "primaryLabel",
      type: "string",
      defaultValue: '"免费开始"',
      description: "主操作按钮文案",
    },
    {
      name: "secondaryLabel",
      type: "string",
      defaultValue: '"了解更多"',
      description: "次操作按钮文案",
    },
    {
      name: "socialProof",
      type: "string",
      defaultValue: '"超过 12,000 支团队正在使用"',
      description: "团队头像叠放旁的背书文案",
    },
    {
      name: "compact",
      type: "boolean",
      defaultValue: "false",
      description: "紧凑密度模式",
    },
    {
      name: "onPrimaryClick",
      type: "() => void",
      defaultValue: "—",
      description: "主按钮点击回调",
    },
    {
      name: "onSecondaryClick",
      type: "() => void",
      defaultValue: "—",
      description: "次按钮点击回调",
    },
  ],
  accessibility: [
    "内部卡片标题采用语义段落排版，不与宿主页面主标题层级冲突。",
    "所有图标与顶部氛围渐变层均声明 aria-hidden，按钮与进度条保持完整键盘与读屏语义。",
  ],
};
