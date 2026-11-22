"use client";

/**
 * 详情页的主面板：「预览 / 用法 / 代码」三个页签，右上角是复制提示词的按钮。
 * 页签的键盘导航与 ARIA 语义由 Base UI 的 Tabs 提供。
 */
import { Tabs } from "@base-ui/react/tabs";
import type { ReactNode } from "react";
import { SpecimenStage } from "@/gallery/specimen-stage";
import { CopyButton } from "./copy-button";
import { CODE_PANEL_CLASSES, TAB_CLASSES, TAB_LIST_CLASSES } from "./panel-tabs";

interface ComponentMainProps {
  /** 实时渲染的主示例 */
  preview: ReactNode;
  /** 最小用法示例，已高亮 */
  usageHtml: string;
  /** 组件的完整源码，已高亮 */
  sourceHtml: string;
  /** 给 AI 助手的安装提示词 */
  prompt: string;
}

export const ComponentMain = ({ preview, usageHtml, sourceHtml, prompt }: ComponentMainProps) => (
  <Tabs.Root defaultValue="preview" data-testid="component-main">
    <Tabs.List className={TAB_LIST_CLASSES}>
      <Tabs.Tab value="preview" className={TAB_CLASSES}>
        预览
      </Tabs.Tab>
      <Tabs.Tab value="usage" className={TAB_CLASSES}>
        用法
      </Tabs.Tab>
      <Tabs.Tab value="code" className={TAB_CLASSES}>
        代码
      </Tabs.Tab>
    </Tabs.List>
    <div className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-(--site-tile)">
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full border border-border bg-background/80 pl-3 text-xs text-muted-foreground backdrop-blur-md">
        复制提示词
        <CopyButton text={prompt} label="复制提示词" />
      </div>
      <Tabs.Panel value="preview" className="outline-none">
        <SpecimenStage className="min-h-[420px]">{preview}</SpecimenStage>
      </Tabs.Panel>
      {/* 源码由本站在构建时生成，不含用户输入 */}
      <Tabs.Panel
        value="usage"
        tabIndex={0}
        className={`min-h-[420px] pt-10 ${CODE_PANEL_CLASSES}`}
        dangerouslySetInnerHTML={{ __html: usageHtml }}
      />
      <Tabs.Panel
        value="code"
        tabIndex={0}
        className={`max-h-[640px] overflow-y-auto pt-10 ${CODE_PANEL_CLASSES}`}
        dangerouslySetInnerHTML={{ __html: sourceHtml }}
      />
    </div>
  </Tabs.Root>
);
