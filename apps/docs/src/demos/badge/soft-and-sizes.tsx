"use client";

import { Badge } from "@matt-ui/ui";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function BadgeSoftAndSizesDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="soft" icon={<Sparkles />}>
          AI 自动校验
        </Badge>
        <Badge variant="success" dot pulse>
          实时在线
        </Badge>
        <Badge variant="outline" icon={<ShieldCheck />}>
          WCAG AA
        </Badge>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge size="sm" variant="soft">
          Small · Soft
        </Badge>
        <Badge size="sm" variant="secondary">
          Small · Secondary
        </Badge>
        <Badge size="md" variant="soft">
          Medium · Soft
        </Badge>
        <Badge size="md" variant="outline">
          Medium · Outline
        </Badge>
      </div>
    </div>
  );
}
