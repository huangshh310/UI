"use client";

/**
 * 详情页中的一个示例：无框线卡片承载标题、视口宽度切换与「预览 / 代码」面板。
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
  responsive,
  viewport,
  onViewportChange,
}: {
  id: string;
  name: string;
  responsive: boolean;
  viewport: PreviewViewport;
  onViewportChange: (next: PreviewViewport) => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4 px-3 pt-1.5 pb-3">
    <h3 id={`${id}-title`} className="text-[15px] font-semibold tracking-tight">
      {name}
    </h3>
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
  preview,
  codeHtml,
  responsive = false,
}: SpecimenBlockProps) => {
  const [viewport, setViewport] = useState<PreviewViewport>("full");

  return (
    <section id={id} data-testid="specimen-block" aria-labelledby={`${id}-title`}>
      <Tabs.Root defaultValue="preview">
        <div className="overflow-hidden rounded-3xl bg-(--site-surface) p-3 shadow-xs">
          <SpecimenHeader
            id={id}
            name={name}
            responsive={responsive}
            viewport={viewport}
            onViewportChange={setViewport}
          />
          <Tabs.Panel value="preview" className="outline-none">
            <SpecimenStage
              className={`${responsive ? "min-h-80 p-4 sm:p-7" : "min-h-68"} rounded-2xl`}
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
