"use client";

/**
 * 安装说明：「CLI」页签是一行 shadcn 命令，「手动」页签列出依赖与复制源码的步骤。
 */
import { Tabs } from "@base-ui/react/tabs";
import { CopyButton } from "./copy-button";
import { TAB_CLASSES, TAB_LIST_CLASSES } from "./panel-tabs";

interface InstallBlockProps {
  /** shadcn CLI 的安装命令 */
  command: string;
  /** 手动安装时需要的 npm 依赖 */
  dependencies: string[];
  /** 组件文件在使用者项目中的位置 */
  targetPath: string;
}

/** 一行可复制的命令 */
const CommandLine = ({ command, label }: { command: string; label: string }) => (
  <div className="flex items-center justify-between gap-4">
    <code className="overflow-x-auto font-mono text-sm whitespace-nowrap">{command}</code>
    <CopyButton text={command} label={label} />
  </div>
);

export const InstallBlock = ({ command, dependencies, targetPath }: InstallBlockProps) => (
  <section
    data-testid="install-block"
    aria-labelledby="install-title"
    className="rounded-2xl border border-border bg-(--site-tile) p-6"
  >
    <Tabs.Root defaultValue="cli">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 id="install-title" className="text-lg font-semibold tracking-tight">
          安装
        </h2>
        <Tabs.List className={TAB_LIST_CLASSES}>
          <Tabs.Tab value="cli" className={TAB_CLASSES}>
            CLI
          </Tabs.Tab>
          <Tabs.Tab value="manual" className={TAB_CLASSES}>
            手动
          </Tabs.Tab>
        </Tabs.List>
      </div>
      <Tabs.Panel value="cli" className="outline-none">
        <p className="mb-4 text-sm text-muted-foreground">
          通过 shadcn CLI 把组件源码直接加入你的项目：
        </p>
        <CommandLine command={command} label="复制安装命令" />
      </Tabs.Panel>
      <Tabs.Panel value="manual" className="outline-none">
        <ol className="flex list-decimal flex-col gap-4 pl-5 text-sm text-muted-foreground">
          <li>
            安装依赖：
            <CommandLine command={`pnpm add ${dependencies.join(" ")}`} label="复制依赖安装命令" />
          </li>
          <li>
            把上方「代码」页签中的源码保存为
            <code className="mx-1 font-mono text-foreground">{targetPath}</code>。
          </li>
          <li>
            确认项目里有 <code className="mx-1 font-mono text-foreground">@/lib/utils</code> 导出的
            cn 函数，并在主题中定义 signal 等颜色变量。
          </li>
        </ol>
      </Tabs.Panel>
    </Tabs.Root>
  </section>
);
