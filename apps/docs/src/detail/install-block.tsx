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

const CODE_BADGE =
  "mx-1 rounded-md border border-border bg-(--site-stage) px-1.5 py-0.5 font-mono text-xs text-foreground";

/** 一行可复制的命令 */
const CommandLine = ({ command, label }: { command: string; label: string }) => (
  <div className="mt-2 flex items-center justify-between gap-4 rounded-xl border border-border/80 bg-(--site-stage) py-1.5 pr-1.5 pl-4">
    <code className="overflow-x-auto font-mono text-[13px] whitespace-nowrap text-foreground">
      <span aria-hidden="true" className="mr-2.5 text-muted-foreground select-none">
        $
      </span>
      {command}
    </code>
    <CopyButton text={command} label={label} />
  </div>
);

const ManualSteps = ({ dependencies, targetPath }: Omit<InstallBlockProps, "command">) => (
  <ol className="flex list-decimal flex-col gap-4 pl-5 text-sm text-muted-foreground">
    <li>
      安装依赖：
      <CommandLine command={`pnpm add ${dependencies.join(" ")}`} label="复制依赖安装命令" />
    </li>
    <li>
      把上方「代码」页签中的源码保存为
      <code className={CODE_BADGE}>{targetPath}</code>。
    </li>
    <li>
      确认项目里有 <code className={CODE_BADGE}>@/lib/utils</code> 导出的 cn 函数，并在主题中定义
      signal 等颜色变量。
    </li>
  </ol>
);

export const InstallBlock = ({ command, dependencies, targetPath }: InstallBlockProps) => (
  <section
    data-testid="install-block"
    aria-labelledby="install-title"
    className="rounded-2xl border border-border bg-(--site-surface) p-6 shadow-xs"
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
        <p className="mb-3 text-sm text-muted-foreground">
          通过 shadcn CLI 把组件源码直接加入你的项目：
        </p>
        <CommandLine command={command} label="复制安装命令" />
      </Tabs.Panel>
      <Tabs.Panel value="manual" className="outline-none">
        <ManualSteps dependencies={dependencies} targetPath={targetPath} />
      </Tabs.Panel>
    </Tabs.Root>
  </section>
);
