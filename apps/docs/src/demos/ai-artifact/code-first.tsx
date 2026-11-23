"use client";

import { AiArtifact } from "@matt-ui/ui";

const TOKEN_SNIPPET = `/* 悬浮卡片多层物理阴影与内高光配方 */
:root {
  --ui-specular: rgba(255, 255, 255, 0.72);
  --ui-bevel: rgba(15, 23, 42, 0.08);
  --ui-shadow-sm:
    inset 0 1px 0 0 var(--ui-specular),
    inset 0 -1px 0 0 var(--ui-bevel),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --ui-shadow-md:
    inset 0 1px 0 0 var(--ui-specular),
    0 8px 24px -6px rgba(0, 0, 0, 0.12);
}`;

export default function AiArtifactCodeFirstDemo() {
  return (
    <AiArtifact
      className="w-full max-w-3xl"
      title="shadows.css"
      version="Token 配方"
      language="css"
      previewSurface="obsidian"
      defaultTab="code"
      code={TOKEN_SNIPPET}
      onDownload={() => {}}
      preview={
        <div className="flex w-full max-w-sm flex-col gap-2 rounded-xl border border-solid border-zinc-800 bg-zinc-900 p-4 text-zinc-100 shadow-lg">
          <span className="font-mono text-[11px] text-sky-300">--ui-shadow-md</span>
          <p className="m-0 text-xs leading-relaxed text-zinc-300">
            顶部 1px 物理高光叠加柔和底部扩散阴影，确保暗色曜石画布下的浮层层级清晰锐利。
          </p>
        </div>
      }
    />
  );
}
