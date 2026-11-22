"use client";

/**
 * 首页快捷安装命令卡：支持在 pnpm / npm / bun 之间切换并一键复制。
 * 页签键盘导航与 ARIA 语义由 Base UI 的 Tabs 提供。
 */
import { Tabs } from "@base-ui/react/tabs";
import { useState } from "react";
import { CopyButton } from "@/detail/copy-button";
import { REGISTRY_ADDRESS } from "@/site/constants";

type PackageManager = "pnpm" | "npm" | "bun";

const COMMANDS: Record<PackageManager, string> = {
  pnpm: `pnpm dlx shadcn@latest add ${REGISTRY_ADDRESS}/button`,
  npm: `npx shadcn@latest add ${REGISTRY_ADDRESS}/button`,
  bun: `bunx --bun shadcn@latest add ${REGISTRY_ADDRESS}/button`,
};

const MANAGERS: PackageManager[] = ["pnpm", "npm", "bun"];

export const HeroCli = () => {
  const [manager, setManager] = useState<PackageManager>("pnpm");
  const command = COMMANDS[manager];

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-(--site-surface) text-left shadow-xs">
      <Tabs.Root value={manager} onValueChange={(value) => setManager(value as PackageManager)}>
        <div className="flex items-center justify-between gap-2 border-b border-border/70 px-3 py-2">
          <Tabs.List aria-label="包管理器" className="inline-flex items-center gap-1">
            {MANAGERS.map((item) => (
              <Tabs.Tab
                key={item}
                value={item}
                className="cursor-pointer rounded-lg px-2.5 py-1 font-mono text-xs text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring aria-selected:bg-secondary aria-selected:font-medium aria-selected:text-foreground"
              >
                {item}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <CopyButton text={command} label="复制安装命令" />
        </div>
        <Tabs.Panel value={manager} className="bg-(--site-stage)/60 px-4 py-3.5 outline-none">
          <code className="block overflow-x-auto font-mono text-[13px] whitespace-nowrap text-foreground">
            <span aria-hidden="true" className="mr-2.5 text-muted-foreground select-none">
              $
            </span>
            {command}
          </code>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
};
