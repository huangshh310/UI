/**
 * 示例：Button 的全部视觉变体。
 * 文件顶部的这段注释在展示源码时会被去掉。
 */
import { Button } from "@matt-ui/ui";

export const ButtonVariants = () => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    <Button>Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="link">Link</Button>
  </div>
);
