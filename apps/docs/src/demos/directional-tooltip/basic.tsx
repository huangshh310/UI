"use client";

import { Button, DirectionalTooltip, DirectionalTooltipProvider } from "@matt-ui/ui";

export default function DirectionalTooltipBasicDemo() {
  return (
    <DirectionalTooltipProvider delay={160}>
      <div className="flex flex-wrap items-center gap-2">
        <DirectionalTooltip content="从上方滑入提示" side="top">
          <Button variant="outline" size="sm">
            上方
          </Button>
        </DirectionalTooltip>
        <DirectionalTooltip content="从右侧滑入提示" side="right">
          <Button variant="outline" size="sm">
            右侧
          </Button>
        </DirectionalTooltip>
        <DirectionalTooltip content="从下方滑入提示" side="bottom">
          <Button variant="outline" size="sm">
            下方
          </Button>
        </DirectionalTooltip>
        <DirectionalTooltip content="从左侧滑入提示" side="left">
          <Button variant="outline" size="sm">
            左侧
          </Button>
        </DirectionalTooltip>
      </div>
    </DirectionalTooltipProvider>
  );
}
