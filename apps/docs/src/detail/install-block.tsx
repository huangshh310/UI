"use client";

/**
 * 安装面板：「CLI」页签直接呈现一行源码分发命令，「手动」页签列出依赖与源码位置。
 */
import { Tabs } from "@base-ui/react/tabs";
import { CopyButton } from "./copy-button";
import { TAB_CLASSES, TAB_LIST_CLASSES } from "./panel-tabs";

interface InstallBlockProps {
  command: string;
  dependencies: string[];
  targetPath: string;
}

const CODE_BADGE =
  "mx-1 rounded-md bg-(--site-stage) px-1.5 py-0.5 font-mono text-xs text-foreground";

const CommandLine = ({ command, label }: { command: string; label: string }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl bg-(--site-stage) py-1.5 pr-1.5 pl-4">
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
      <div className="mt-1.5">
        <CommandLine command={`pnpm add ${dependencies.join(" ")}`} label="复制依赖安装命令" />
      </div>
    </li>
    <li>
      将「代码」页签中的源码保存至
      <code className={CODE_BADGE}>{targetPath}</code>。
    </li>
    <li>
      确认项目包含 <code className={CODE_BADGE}>@/lib/utils</code> 的 cn 函数及主题颜色变量。
    </li>
  </ol>
);

export const InstallBlock = ({ command, dependencies, targetPath }: InstallBlockProps) => (
  <section
    data-testid="install-block"
    aria-labelledby="install-title"
    className="rounded-3xl bg-(--site-surface) p-6 shadow-xs"
  >
    <Tabs.Root defaultValue="cli">
      <div className="mb-4 flex items-center justify-between gap-4">
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
        <CommandLine command={command} label="复制安装命令" />
      </Tabs.Panel>
      <Tabs.Panel value="manual" className="outline-none">
        <ManualSteps dependencies={dependencies} targetPath={targetPath} />
      </Tabs.Panel>
    </Tabs.Root>
  </section>
);
