"use client";

/**
 * 详情页中的一个示例：双层卡片结构，顶栏承载标题、说明与「预览 / 代码」切换。
 * 未选中的面板不会渲染。
 */
import { Tabs } from "@base-ui/react/tabs";
import type { ReactNode } from "react";
import { SpecimenStage } from "@/gallery/specimen-stage";
import { CODE_PANEL_CLASSES, TAB_CLASSES, TAB_LIST_CLASSES } from "./panel-tabs";

interface SpecimenBlockProps {
  /** 锚点 id，目录页的卡片链接到这里 */
  id: string;
  name: string;
  description: string;
  /** 实时渲染的示例 */
  preview: ReactNode;
  /** 服务端高亮好的源码 HTML */
  codeHtml: string;
}

export const SpecimenBlock = ({ id, name, description, preview, codeHtml }: SpecimenBlockProps) => (
  <section id={id} data-testid="specimen-block" aria-labelledby={`${id}-title`}>
    <Tabs.Root defaultValue="preview">
      <div className="overflow-hidden rounded-2xl border border-border bg-(--site-surface) shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/75 px-5 py-4">
          <div>
            <h3 id={`${id}-title`} className="text-base font-semibold tracking-tight">
              {name}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <Tabs.List className={TAB_LIST_CLASSES}>
            <Tabs.Tab value="preview" className={TAB_CLASSES}>
              预览
            </Tabs.Tab>
            <Tabs.Tab value="code" className={TAB_CLASSES}>
              代码
            </Tabs.Tab>
          </Tabs.List>
        </div>
        <Tabs.Panel value="preview" className="p-2.5 outline-none">
          <SpecimenStage className="min-h-68 rounded-xl border border-border/65">
            {preview}
          </SpecimenStage>
        </Tabs.Panel>
        {/* 源码由本站在构建时生成，不含用户输入 */}
        <Tabs.Panel
          value="code"
          tabIndex={0}
          className={`min-h-68 ${CODE_PANEL_CLASSES}`}
          dangerouslySetInnerHTML={{ __html: codeHtml }}
        />
      </div>
    </Tabs.Root>
  </section>
);
