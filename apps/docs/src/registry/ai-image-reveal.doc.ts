import AiImageRevealBasicDemo from "@/demos/ai-image-reveal/basic";
import AiImageRevealGalleryDemo from "@/demos/ai-image-reveal/gallery";
import AiImageRevealGeneratingDemo from "@/demos/ai-image-reveal/generating";
import type { ComponentDoc } from "./registry.types";

export const AI_IMAGE_REVEAL_DOC: ComponentDoc = {
  slug: "ai-image-reveal",
  name: "AiImageReveal",
  description:
    "C 端 AI 图像生成显影组件，以克制的胶片光雾等待、柔焦银盐采样凝聚、纯净光学渐进光幕与美术馆级毛玻璃浮层呈现成图过程。",
  category: "ai",
  registryName: "ai-image-reveal",
  dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import { AiImageReveal } from "@/components/ui/ai-image-reveal";

export function Example() {
  return (
    <AiImageReveal
      src="/artwork.png"
      alt="生成的艺术画面"
      variant="framed"
      badge="1024×1024"
      showReplayButton
    />
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "粒子聚拢与高清显影",
      description: "自动采样目标图像色块并驱动粒子马赛克聚拢，支持画廊相框、角标与内联重播。",
      file: "ai-image-reveal/basic.tsx",
      Demo: AiImageRevealBasicDemo,
    },
    {
      slug: "generating",
      name: "异步等待态到显影完成",
      description: "传入 generating 控制毛玻璃粒子呼吸态，图像就绪后无缝进入聚拢降噪流程。",
      file: "ai-image-reveal/generating.tsx",
      Demo: AiImageRevealGeneratingDemo,
      directory: false,
    },
    {
      slug: "gallery",
      name: "画廊卡片与自定义操作槽",
      description: "结合 variant='framed'、radius='xl' 与 actions 槽提供下载/操作悬浮胶囊。",
      file: "ai-image-reveal/gallery.tsx",
      Demo: AiImageRevealGalleryDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "src / alt / generating",
      type: "string | null / string / boolean",
      defaultValue: "— / 必填 / !src",
      description: "目标图像地址、无障碍替代文本与是否强制停留于粒子等待态。",
    },
    {
      name: "variant / radius",
      type: '"default" | "framed" | "glass" / "md" | "lg" | "xl"',
      defaultValue: '"default" / "lg"',
      description: "外框展示风格与画幅圆角等级。",
    },
    {
      name: "badge / showReplayButton / actions",
      type: "string / boolean / ReactNode",
      defaultValue: "— / false / —",
      description: "左上角毛玻璃参数角标、右上角内联重播按钮以及显影完成后的右下角操作槽。",
    },
    {
      name: "aspectRatio / duration / density",
      type: "number / number / number",
      defaultValue: "1 / 2.8 / 1",
      description: "画布宽高比、显影总时长（秒）与粒子采样密度倍率。",
    },
    {
      name: "prompt / generatingLabel / onReveal",
      type: "string / string / () => void",
      defaultValue: '— / "正在生成图像…" / —',
      description: "底部提示词说明（figcaption）、等待胶囊文案与显影完成回调。",
    },
  ],
  accessibility: [
    '使用语义化 <figure> / <figcaption> 与 <output aria-live="polite"> 播报生成进度。',
    "检测到 prefers-reduced-motion 时跳过粒子与模糊滤镜，以轻柔脉冲占位并平滑淡入。",
  ],
};
