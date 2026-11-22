"use client";

/**
 * 详情页的主面板：统一顶栏承载「预览 / 用法 / 代码」页签与「复制提示词」操作，
 * 下方为内嵌点阵舞台或源码区，避免操作胶囊悬空压在预览内容上。
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
    <div className="overflow-hidden rounded-2xl border border-border bg-(--site-surface) shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/75 px-4 py-3">
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
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-(--site-stage) pl-3 text-xs text-muted-foreground">
          <span>复制提示词</span>
          <CopyButton text={prompt} label="复制提示词" />
        </div>
      </div>

      <Tabs.Panel value="preview" className="p-2.5 outline-none">
        <SpecimenStage className="min-h-[400px] rounded-xl border border-border/65">
          {preview}
        </SpecimenStage>
      </Tabs.Panel>
      {/* 源码由本站在构建时生成，不含用户输入 */}
      <Tabs.Panel
        value="usage"
        tabIndex={0}
        className={`min-h-[400px] ${CODE_PANEL_CLASSES}`}
        dangerouslySetInnerHTML={{ __html: usageHtml }}
      />
      <Tabs.Panel
        value="code"
        tabIndex={0}
        className={`max-h-[640px] overflow-y-auto ${CODE_PANEL_CLASSES}`}
        dangerouslySetInnerHTML={{ __html: sourceHtml }}
      />
    </div>
  </Tabs.Root>
);
