"use client";

/**
 * 详情页中的一个示例：标题、说明，以及「预览 / 代码」两个页签。
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
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 id={`${id}-title`} className="text-lg font-semibold tracking-tight">
            {name}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
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
      <div className="overflow-hidden rounded-2xl border border-border bg-(--site-tile)">
        <Tabs.Panel value="preview" className="outline-none">
          <SpecimenStage className="min-h-72">{preview}</SpecimenStage>
        </Tabs.Panel>
        {/* 源码由本站在构建时生成，不含用户输入 */}
        <Tabs.Panel
          value="code"
          tabIndex={0}
          className={`min-h-72 ${CODE_PANEL_CLASSES}`}
          dangerouslySetInnerHTML={{ __html: codeHtml }}
        />
      </div>
    </Tabs.Root>
  </section>
);
