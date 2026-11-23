/**
 * 示例：胶囊圆角按钮，适合轻量 C 端行动号召与筛选操作。
 */
import { Button } from "@matt-ui/ui";

export const ButtonRadiusDemo = () => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    <Button radius="pill">开始使用</Button>
    <Button variant="signal" radius="pill">
      立即发布
    </Button>
    <Button variant="outline" radius="pill">
      查看定价
    </Button>
    <Button variant="secondary" size="sm" radius="pill">
      了解更多
    </Button>
  </div>
);
