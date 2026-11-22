/**
 * 示例：禁用状态。
 */
import { Button } from "@matt-ui/ui";

export const ButtonDisabled = () => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    <Button disabled>Primary</Button>
    <Button variant="outline" disabled>
      Outline
    </Button>
    <Button variant="signal" disabled>
      Signal
    </Button>
  </div>
);
