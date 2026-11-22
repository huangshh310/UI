"use client";

/**
 * 详情页的主面板：统一顶栏承载「预览 / 用法 / 代码」页签、响应式宽度切换器与「复制提示词」操作。
 */
import { Tabs } from "@base-ui/react/tabs";
import { useState, type ReactNode } from "react";
import { SpecimenStage } from "@/gallery/specimen-stage";
import { CopyButton } from "./copy-button";
import { CODE_PANEL_CLASSES, TAB_CLASSES, TAB_LIST_CLASSES } from "./panel-tabs";
import { type PreviewViewport, ViewportFrame, ViewportSwitcher } from "./viewport-preview";

interface ComponentMainProps {
  preview: ReactNode;
  usageHtml: string;
  sourceHtml: string;
  prompt: string;
  responsive?: boolean;
}

const MainToolbar = ({
  prompt,
  responsive,
  viewport,
  onViewportChange,
}: {
  prompt: string;
  responsive: boolean;
  viewport: PreviewViewport;
  onViewportChange: (next: PreviewViewport) => void;
}) => (
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
    <div className="flex items-center gap-2">
      {responsive && <ViewportSwitcher value={viewport} onChange={onViewportChange} />}
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-(--site-stage) pl-3 text-xs text-muted-foreground">
        <span>复制提示词</span>
        <CopyButton text={prompt} label="复制提示词" />
      </div>
    </div>
  </div>
);

export const ComponentMain = ({
  preview,
  usageHtml,
  sourceHtml,
  prompt,
  responsive = false,
}: ComponentMainProps) => {
  const [viewport, setViewport] = useState<PreviewViewport>("full");

  return (
    <Tabs.Root defaultValue="preview" data-testid="component-main">
      <div className="overflow-hidden rounded-2xl border border-border bg-(--site-surface) shadow-xs">
        <MainToolbar
          prompt={prompt}
          responsive={responsive}
          viewport={viewport}
          onViewportChange={setViewport}
        />
        <Tabs.Panel value="preview" className="p-2.5 outline-none">
          <SpecimenStage
            className={`${responsive ? "min-h-[420px] p-4 sm:p-7" : "min-h-[400px]"} rounded-xl border border-border/65`}
          >
            {responsive ? <ViewportFrame viewport={viewport}>{preview}</ViewportFrame> : preview}
          </SpecimenStage>
        </Tabs.Panel>
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
};
