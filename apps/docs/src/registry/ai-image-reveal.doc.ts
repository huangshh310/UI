import AiImageRevealBasicDemo from "@/demos/ai-image-reveal/basic";
import AiImageRevealGeneratingDemo from "@/demos/ai-image-reveal/generating";
import type { ComponentDoc } from "./registry.types";

export const AI_IMAGE_REVEAL_DOC: ComponentDoc = {
  slug: "ai-image-reveal",
  name: "AiImageReveal",
  description:
    "AI 图像生成显影组件，模拟粒子云呼吸等待、像素采样聚拢降噪马赛克到高清柔焦显影的完整过程。",
  category: "ai",
  registryName: "ai-image-reveal",
  dependencies: ["motion"],
  createdAt: "2026-11-23",
  usage: `import { AiImageReveal } from "@/components/ui/ai-image-reveal";

export function Example() {
  return <AiImageReveal src="/artwork.png" alt="生成的艺术画面" aspectRatio={1} />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "粒子聚拢与高清显影",
      description: "自动采样目标图像色块并驱动粒子马赛克聚拢，支持重播与切换图像。",
      file: "ai-image-reveal/basic.tsx",
      Demo: AiImageRevealBasicDemo,
    },
    {
      slug: "generating",
      name: "异步等待态到显影完成",
      description: "传入 generating 控制粒子呼吸态，图像就绪后无缝进入聚拢降噪流程。",
      file: "ai-image-reveal/generating.tsx",
      Demo: AiImageRevealGeneratingDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "src",
      type: "string | null",
      defaultValue: "—",
      description: "目标图像地址；留空时停留粒子云等待态",
    },
    { name: "alt", type: "string", defaultValue: "必填", description: "图像无障碍替代文本" },
    {
      name: "generating",
      type: "boolean",
      defaultValue: "!src",
      description: "强制停留在生成等待态",
    },
    {
      name: "aspectRatio",
      type: "number",
      defaultValue: "1",
      description: "画布宽高比（如 1、16/10）",
    },
    { name: "duration", type: "number", defaultValue: "2.8", description: "显影总时长（秒）" },
    { name: "density", type: "number", defaultValue: "1", description: "粒子采样密度倍率" },
    {
      name: "prompt",
      type: "string",
      defaultValue: "—",
      description: "底部提示词说明（figcaption）",
    },
    {
      name: "onReveal",
      type: "() => void",
      defaultValue: "—",
      description: "显影全部完成后的回调",
    },
  ],
  accessibility: [
    '使用语义化 <figure> / <figcaption> 与 <output aria-live="polite"> 播报生成进度。',
    "检测到 prefers-reduced-motion 时跳过粒子与模糊滤镜，以轻柔脉冲占位并平滑淡入。",
  ],
};
