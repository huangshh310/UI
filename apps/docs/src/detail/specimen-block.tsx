"use client";

/**
 * 详情页中的一个示例：标题、说明，以及「预览 / 代码」两个页签。
 * 页签的键盘导航与 ARIA 语义由 Base UI 的 Tabs 提供；未选中的面板不会渲染。
 */
import { Tabs } from "@base-ui/react/tabs";
import type { ReactNode } from "react";
import { SpecimenStage } from "@/gallery/specimen-stage";

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

const TAB_CLASSES =
  "cursor-pointer rounded-sm px-3 py-1 text-sm text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-selected:bg-accent aria-selected:text-foreground";

export const SpecimenBlock = ({ id, name, description, preview, codeHtml }: SpecimenBlockProps) => (
  <section id={id} data-testid="specimen-block" aria-labelledby={`${id}-title`}>
    <Tabs.Root defaultValue="preview">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id={`${id}-title`} className="text-xl font-semibold tracking-tight">
            {name}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        </div>
        <Tabs.List className="flex gap-1 rounded-md border border-border p-1">
          <Tabs.Tab value="preview" className={TAB_CLASSES}>
            预览
          </Tabs.Tab>
          <Tabs.Tab value="code" className={TAB_CLASSES}>
            代码
          </Tabs.Tab>
        </Tabs.List>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Tabs.Panel value="preview" className="outline-none">
          <SpecimenStage className="min-h-80">{preview}</SpecimenStage>
        </Tabs.Panel>
        {/* 源码由本站在构建时生成，不含用户输入 */}
        <Tabs.Panel
          value="code"
          tabIndex={0}
          className="min-h-80 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          dangerouslySetInnerHTML={{ __html: codeHtml }}
        />
      </div>
    </Tabs.Root>
  </section>
);
