/**
 * 示例：PressButton 的基本用法，以及不同按压强度与胶囊圆角。
 */
import { PressButton } from "@matt-ui/ui";

export const PressButtonBasic = () => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    <PressButton>按住试试</PressButton>
    <PressButton variant="outline" pressStrength={0.06}>
      更强的按压
    </PressButton>
    <PressButton variant="signal" radius="pill" pressStrength={0.05}>
      胶囊触感
    </PressButton>
  </div>
);
