/**
 * 示例：信号色按钮，留给页面上最需要被看到的那一个操作。
 */
import { Button } from "@matt-ui/ui";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

export const ButtonSignal = () => (
  <div className="flex flex-col items-center gap-4">
    <Button variant="signal" size="lg">
      开始使用
      <ArrowRightIcon weight="bold" aria-hidden="true" />
    </Button>
    <Button variant="ghost" size="sm">
      查看文档
    </Button>
  </div>
);
