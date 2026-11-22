/**
 * 示例：PressButton 的基本用法，以及更强的按压强度。
 */
import { PressButton } from "@matt-ui/ui";

export const PressButtonBasic = () => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    <PressButton>按住试试</PressButton>
    <PressButton variant="outline" pressStrength={0.06}>
      更强的按压
    </PressButton>
  </div>
);
