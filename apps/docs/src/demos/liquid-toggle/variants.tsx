"use client";

import { LiquidToggle } from "@matt-ui/motion";

export default function LiquidToggleVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <LiquidToggle size="sm" tone="primary" defaultChecked aria-label="小号纯色开关" />
        <span>Small</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <LiquidToggle size="md" tone="signal" defaultChecked aria-label="中号信号色开关" />
        <span>Signal</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <LiquidToggle
          size="md"
          tone="emerald"
          variant="subtle"
          defaultChecked
          aria-label="翡翠微描边开关"
        />
        <span>Emerald</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <LiquidToggle size="lg" tone="destructive" defaultChecked aria-label="大号警示开关" />
        <span>Large</span>
      </div>
    </div>
  );
}
