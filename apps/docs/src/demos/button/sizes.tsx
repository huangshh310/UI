/**
 * 示例：三种带文字的尺寸。
 */
import { Button } from "@matt-ui/ui";

export const ButtonSizes = () => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);
