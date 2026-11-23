"use client";

import { Button, DirectionalTooltip, DirectionalTooltipProvider } from "@matt-ui/ui";

export default function DirectionalTooltipVariantsDemo() {
  return (
    <DirectionalTooltipProvider delay={120}>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <DirectionalTooltip content="磨砂浅浮层提示" shortcut="⌘1" variant="default">
          <Button variant="outline" size="sm">
            default 磨砂
          </Button>
        </DirectionalTooltip>
        <DirectionalTooltip content="高对比反色提示" shortcut="⌘2" variant="inverted">
          <Button variant="outline" size="sm">
            inverted 反色
          </Button>
        </DirectionalTooltip>
        <DirectionalTooltip content="轻透玻璃悬浮气泡" shortcut="⌘3" variant="glass" size="md">
          <Button variant="outline" size="sm">
            glass 轻透
          </Button>
        </DirectionalTooltip>
      </div>
    </DirectionalTooltipProvider>
  );
}
