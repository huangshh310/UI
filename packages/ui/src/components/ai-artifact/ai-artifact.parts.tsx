"use client";

/**
 * AiArtifact 顶部 Window Chrome 工具栏、版本分段切换器与视图切换部件。
 */
import { cn } from "@matt-ui/utils";
import { Check, Code2, Copy, Download, Eye, FileCode2 } from "lucide-react";
import type { AiArtifactTab, AiArtifactVariant } from "./ai-artifact.types.js";

const ARTIFACT_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const segmentTrackClass = (obsidian: boolean) =>
  cn(
    "inline-flex h-7 items-center gap-0.5 rounded-lg border border-solid p-0.5",
    obsidian
      ? "border-zinc-800 bg-zinc-900"
      : "border-border/75 bg-muted/65 dark:border-white/10 dark:bg-white/[0.04]",
  );

const segmentItemClass = (active: boolean, obsidian: boolean) => {
  if (active) {
    return obsidian
      ? "bg-zinc-800 text-zinc-100 shadow-2xs"
      : "bg-card text-foreground shadow-2xs dark:bg-white/12";
  }
  return obsidian
    ? "bg-transparent text-zinc-400 hover:text-zinc-100"
    : "bg-transparent text-muted-foreground hover:text-foreground";
};

const TabToggleButtons = ({
  tab,
  obsidian,
  onTabChange,
}: {
  tab: AiArtifactTab;
  obsidian: boolean;
  onTabChange: (next: AiArtifactTab) => void;
}) => (
  <div className={segmentTrackClass(obsidian)}>
    {(
      [
        { id: "preview", label: "预览", Icon: Eye },
        { id: "code", label: "源码", Icon: Code2 },
      ] as const
    ).map(({ id, label, Icon }) => (
      <button
        key={id}
        type="button"
        aria-pressed={tab === id}
        onClick={() => onTabChange(id)}
        className={cn(
          "inline-flex h-full cursor-pointer items-center gap-1.5 rounded-md border border-solid border-transparent px-2.5 font-sans text-[11px] font-medium transition-colors",
          ARTIFACT_FOCUS_RING,
          segmentItemClass(tab === id, obsidian),
        )}
      >
        <Icon aria-hidden="true" className="size-3" />
        <span>{label}</span>
      </button>
    ))}
  </div>
);

const VersionSwitcher = ({
  activeVersion,
  versions,
  obsidian,
  onVersionChange,
}: {
  activeVersion: string;
  versions?: string[];
  obsidian: boolean;
  onVersionChange: (ver: string) => void;
}) => {
  if (!versions || versions.length <= 1) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-md border border-solid px-1.5 py-0.5 font-mono text-[11px] tabular-nums",
          obsidian
            ? "border-zinc-800 bg-zinc-900 text-zinc-300"
            : "border-border/75 bg-muted/50 text-muted-foreground dark:border-white/10 dark:bg-white/[0.04]",
        )}
      >
        {activeVersion}
      </span>
    );
  }
  return (
    <div className={segmentTrackClass(obsidian)}>
      {versions.map((ver) => (
        <button
          key={ver}
          type="button"
          aria-pressed={activeVersion === ver}
          onClick={() => onVersionChange(ver)}
          className={cn(
            "inline-flex h-full cursor-pointer items-center rounded-md border border-solid border-transparent px-2 font-mono text-[11px] font-medium tabular-nums transition-colors",
            ARTIFACT_FOCUS_RING,
            segmentItemClass(activeVersion === ver, obsidian),
          )}
        >
          {ver}
        </button>
      ))}
    </div>
  );
};

interface ToolbarActionsProps {
  variant: AiArtifactVariant;
  tab: AiArtifactTab;
  obsidian: boolean;
  copied: boolean;
  hasDownload: boolean;
  onTabChange: (next: AiArtifactTab) => void;
  onCopyClick: () => void;
  onDownloadClick: () => void;
}

const ToolbarActions = (p: ToolbarActionsProps) => {
  const actionBtn = cn(
    "inline-flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-solid px-2.5 font-sans text-[11px] font-medium transition-colors",
    ARTIFACT_FOCUS_RING,
    p.obsidian
      ? "border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
      : "border-border/75 bg-card text-foreground hover:bg-accent dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]",
  );
  const iconTone = p.obsidian ? "text-zinc-300" : "text-muted-foreground";
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {p.variant !== "split" && (
        <TabToggleButtons tab={p.tab} obsidian={p.obsidian} onTabChange={p.onTabChange} />
      )}
      <button
        type="button"
        aria-label={p.copied ? "已复制源码" : "复制源码"}
        onClick={p.onCopyClick}
        className={actionBtn}
      >
        {p.copied ? (
          <Check aria-hidden="true" className="size-3 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Copy aria-hidden="true" className={cn("size-3", iconTone)} />
        )}
        <span>{p.copied ? "已复制" : "复制"}</span>
      </button>
      {p.hasDownload && (
        <button
          type="button"
          aria-label="下载源码"
          onClick={p.onDownloadClick}
          className={actionBtn}
        >
          <Download aria-hidden="true" className={cn("size-3", iconTone)} />
          <span>下载</span>
        </button>
      )}
    </div>
  );
};

export interface ArtifactToolbarProps {
  title: string;
  variant: AiArtifactVariant;
  obsidian: boolean;
  activeVersion: string;
  versions?: string[];
  language: string;
  lineCount: number;
  tab: AiArtifactTab;
  copied: boolean;
  hasDownload: boolean;
  onVersionChange: (ver: string) => void;
  onTabChange: (next: AiArtifactTab) => void;
  onCopyClick: () => void;
  onDownloadClick: () => void;
}

export const ArtifactToolbar = (p: ArtifactToolbarProps) => {
  const muted = p.obsidian ? "text-zinc-400" : "text-muted-foreground";
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2.5 border-b border-solid",
        p.variant === "compact" ? "px-3.5 py-2.5" : "px-4 py-3",
        p.obsidian
          ? "border-zinc-800 bg-zinc-900/80"
          : "border-border/75 bg-muted/30 dark:border-white/10 dark:bg-white/[0.025]",
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-solid",
            p.obsidian
              ? "border-zinc-700 bg-zinc-900 text-sky-300"
              : "border-border/80 bg-card text-foreground shadow-2xs dark:border-white/10 dark:bg-white/[0.05]",
          )}
        >
          <FileCode2 className="size-3.5" />
        </span>
        <span className="truncate font-mono text-xs font-semibold tracking-tight">{p.title}</span>
        <VersionSwitcher
          activeVersion={p.activeVersion}
          versions={p.versions}
          obsidian={p.obsidian}
          onVersionChange={p.onVersionChange}
        />
        <span className={cn("hidden font-mono text-[11px] tabular-nums md:inline", muted)}>
          {p.language.toUpperCase()} · {p.lineCount} 行
        </span>
      </div>
      <ToolbarActions
        variant={p.variant}
        tab={p.tab}
        obsidian={p.obsidian}
        copied={p.copied}
        hasDownload={p.hasDownload}
        onTabChange={p.onTabChange}
        onCopyClick={p.onCopyClick}
        onDownloadClick={p.onDownloadClick}
      />
    </div>
  );
};
