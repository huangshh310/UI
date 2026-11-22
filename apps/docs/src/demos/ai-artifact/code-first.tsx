"use client";

import { AiArtifact } from "@matt-ui/ui";

const TOKEN_SNIPPET = `--ui-shadow-sm:
  inset 0 1px 0 0 var(--ui-specular),
  inset 0 -1px 0 0 var(--ui-bevel),
  0 1px 2px 0 rgba(0, 0, 0, 0.06);`;

export default function AiArtifactCodeFirstDemo() {
  return (
    <AiArtifact
      title="shadows.css"
      version="Token 配方"
      language="css"
      defaultTab="code"
      code={TOKEN_SNIPPET}
      preview={<span className="font-mono text-xs text-muted-foreground">--ui-shadow-sm 预览</span>}
    />
  );
}
