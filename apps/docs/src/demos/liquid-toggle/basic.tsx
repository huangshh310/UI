/**
 * 示例：LiquidToggle，用旁边的文字作为它的可访问名称。
 */
import { LiquidToggle } from "@matt-ui/motion";

export const LiquidToggleBasic = () => (
  <div className="flex items-center gap-3 text-sm">
    <LiquidToggle defaultChecked aria-labelledby="liquid-toggle-label" />
    <span id="liquid-toggle-label">推送通知</span>
  </div>
);
