"use client";

import { AiArtifact, Badge, Button } from "@matt-ui/ui";
import { Sparkles } from "lucide-react";

const CODE = `export function UpgradeCard() {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-md">
      <Badge variant="signal">Pro · 200K Context</Badge>
      <p className="mt-2 text-sm font-semibold">多模态智能体工作台</p>
      <Button variant="signal" size="sm">立即体验</Button>
    </div>
  );
}`;

export default function AiArtifactBasicDemo() {
  return (
    <AiArtifact
      title="UpgradeCard.tsx"
      versions={["v1", "v2", "v3"]}
      code={CODE}
      preview={
        <div className="flex w-full max-w-xs flex-col gap-3 rounded-2xl border border-solid border-border/90 bg-card p-4 shadow-md">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="signal" shape="tag">
              Pro · 200K
            </Badge>
            <Sparkles aria-hidden="true" className="size-3.5 text-signal" />
          </div>
          <div>
            <p className="m-0 text-sm font-semibold text-foreground">多模态智能体工作台</p>
            <p className="m-0 mt-0.5 text-xs text-muted-foreground">
              内建语音极光球、RAG 溯源与护栏审批流。
            </p>
          </div>
          <Button variant="signal" size="sm" className="w-fit">
            立即体验
          </Button>
        </div>
      }
    />
  );
}
