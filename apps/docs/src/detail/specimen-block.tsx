"use client";

/**
 * 详情页中的一个示例：双层卡片结构，顶栏承载标题、说明、响应式宽度切换器与「预览 / 代码」切换。
 */
import { Tabs } from "@base-ui/react/tabs";
import { useState, type ReactNode } from "react";
import { SpecimenStage } from "@/gallery/specimen-stage";
import { CODE_PANEL_CLASSES, TAB_CLASSES, TAB_LIST_CLASSES } from "./panel-tabs";
import { type PreviewViewport, ViewportFrame, ViewportSwitcher } from "./viewport-preview";

interface SpecimenBlockProps {
  id: string;
  name: string;
  description: string;
  preview: ReactNode;
  codeHtml: string;
  responsive?: boolean;
}

const SpecimenHeader = ({
  id,
  name,
  description,
  responsive,
  viewport,
  onViewportChange,
}: {
  id: string;
  name: string;
  description: string;
  responsive: boolean;
  viewport: PreviewViewport;
  onViewportChange: (next: PreviewViewport) => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/75 px-5 py-4">
    <div>
      <h3 id={`${id}-title`} className="text-base font-semibold tracking-tight">
        {name}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
    <div className="flex items-center gap-2">
      {responsive && <ViewportSwitcher value={viewport} onChange={onViewportChange} />}
      <Tabs.List className={TAB_LIST_CLASSES}>
        <Tabs.Tab value="preview" className={TAB_CLASSES}>
          预览
        </Tabs.Tab>
        <Tabs.Tab value="code" className={TAB_CLASSES}>
          代码
        </Tabs.Tab>
      </Tabs.List>
    </div>
  </div>
);

export const SpecimenBlock = ({
  id,
  name,
  description,
  preview,
  codeHtml,
  responsive = false,
}: SpecimenBlockProps) => {
  const [viewport, setViewport] = useState<PreviewViewport>("full");

  return (
    <section id={id} data-testid="specimen-block" aria-labelledby={`${id}-title`}>
      <Tabs.Root defaultValue="preview">
        <div className="overflow-hidden rounded-2xl border border-border bg-(--site-surface) shadow-xs">
          <SpecimenHeader
            id={id}
            name={name}
            description={description}
            responsive={responsive}
            viewport={viewport}
            onViewportChange={setViewport}
          />
          <Tabs.Panel value="preview" className="p-2.5 outline-none">
            <SpecimenStage
              className={`${responsive ? "min-h-80 p-4 sm:p-7" : "min-h-68"} rounded-xl border border-border/65`}
            >
              {responsive ? <ViewportFrame viewport={viewport}>{preview}</ViewportFrame> : preview}
            </SpecimenStage>
          </Tabs.Panel>
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
};
