/**
 * 文档中的一行命令：等宽字体显示，带提示符与内嵌框，右侧为一键复制按钮。
 */
import { CopyButton } from "@/detail/copy-button";

export const DocCommand = ({ command }: { command: string }) => (
  <div className="my-4 flex items-center justify-between gap-4 rounded-xl border border-border bg-(--site-stage) py-1.5 pr-1.5 pl-4">
    <code className="overflow-x-auto font-mono text-[13px] whitespace-nowrap text-foreground">
      <span aria-hidden="true" className="mr-2.5 text-muted-foreground select-none">
        $
      </span>
      {command}
    </code>
    <CopyButton text={command} label={`复制命令：${command}`} />
  </div>
);
