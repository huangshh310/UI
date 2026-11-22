/**
 * 示例：文字与图标并排。图标作为子元素传入，尺寸自动统一。
 */
import { Button } from "@matt-ui/ui";
import { DownloadSimpleIcon, GitBranchIcon } from "@phosphor-icons/react/dist/ssr";

export const ButtonWithIcon = () => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    <Button>
      <DownloadSimpleIcon weight="bold" aria-hidden="true" />
      下载
    </Button>
    <Button variant="outline">
      <GitBranchIcon weight="bold" aria-hidden="true" />
      新建分支
    </Button>
  </div>
);
