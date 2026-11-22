"use client";

import { Badge } from "@matt-ui/ui";

export default function BadgeShapesDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge shape="pill" variant="default">
          Pill · Default
        </Badge>
        <Badge shape="pill" variant="signal">
          Pill · Signal
        </Badge>
        <Badge shape="pill" variant="outline">
          Pill · Outline
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge shape="tag" variant="secondary">
          v2.4.0
        </Badge>
        <Badge shape="tag" variant="outline">
          TypeScript
        </Badge>
        <Badge shape="tag" variant="signal">
          NEW
        </Badge>
      </div>
    </div>
  );
}
