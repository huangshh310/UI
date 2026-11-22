/**
 * 示例：只含图标的方形按钮。没有可见文字，必须提供 aria-label。
 */
import { Button } from "@matt-ui/ui";
import { CopyIcon, GearSixIcon, MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";

export const ButtonIconOnly = () => (
  <div className="flex items-center justify-center gap-2">
    <Button size="icon" variant="outline" aria-label="搜索">
      <MagnifyingGlassIcon weight="bold" aria-hidden="true" />
    </Button>
    <Button size="icon" variant="outline" aria-label="复制">
      <CopyIcon weight="bold" aria-hidden="true" />
    </Button>
    <Button size="icon" variant="ghost" aria-label="设置">
      <GearSixIcon weight="bold" aria-hidden="true" />
    </Button>
  </div>
);
