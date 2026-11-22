/**
 * 安装说明：一行命令加复制按钮。
 */
import { CopyButton } from "./copy-button";

export const InstallBlock = ({ command }: { command: string }) => (
  <section aria-labelledby="install-title">
    <h2 id="install-title" className="mb-4 text-xl font-semibold tracking-tight">
      安装
    </h2>
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card py-2 pr-2 pl-5">
      <code className="overflow-x-auto font-mono text-sm whitespace-nowrap">{command}</code>
      <CopyButton text={command} label="复制安装命令" />
    </div>
    <p className="mt-3 text-sm text-muted-foreground">
      包尚未发布到 npm，这条命令目前还不能使用。发布后，在入口文件中引入一次
      <code className="mx-1 font-mono text-foreground">@matt-ui/ui/styles.css</code>
      即可。
    </p>
  </section>
);
