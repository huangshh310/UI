"use client";

/**
 * AiArtifact：Claude Artifacts / v0 风格的 AI 生成产物画布，支持版本切换、预览/暗色源码视图与一键复制。
 */
import { cn } from "@matt-ui/utils";
import { Check, Code2, Copy, Download, Eye, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../badge/index.js";
import type {
  AiArtifactPreviewSurface,
  AiArtifactProps,
  AiArtifactTab,
  AiArtifactVariant,
} from "./ai-artifact.types.js";
import { ARTIFACT_PREVIEW_SURFACE, artifactShellVariants } from "./ai-artifact.variants.js";

const TabToggleButtons = ({
  tab,
  onTabChange,
}: {
  tab: AiArtifactTab;
  onTabChange: (next: AiArtifactTab) => void;
}) => (
  <div className="inline-flex items-center gap-0.5 rounded-full border border-solid border-border/80 bg-secondary/75 p-0.5">
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
          "inline-flex h-6 cursor-pointer items-center gap-1 rounded-full border-0 px-2.5 font-sans text-[11px] font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
          tab === id
            ? "bg-card text-foreground shadow-xs"
            : "bg-transparent text-muted-foreground hover:text-foreground",
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
  onVersionChange,
}: {
  activeVersion: string;
  versions?: string[];
  onVersionChange: (ver: string) => void;
}) =>
  versions && versions.length > 1 ? (
    <div className="inline-flex items-center gap-0.5 rounded-md border border-solid border-border/80 bg-card p-0.5">
      {versions.map((ver) => (
        <button
          key={ver}
          type="button"
          aria-pressed={activeVersion === ver}
          onClick={() => onVersionChange(ver)}
          className={cn(
            "cursor-pointer rounded border-0 px-1.5 py-0.5 font-mono text-[10px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
            activeVersion === ver
              ? "bg-signal text-signal-foreground"
              : "bg-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {ver}
        </button>
      ))}
    </div>
  ) : (
    <Badge variant="outline" shape="tag">
      {activeVersion}
    </Badge>
  );

interface ToolbarProps {
  title: string;
  variant: AiArtifactVariant;
  activeVersion: string;
  versions?: string[];
  tab: AiArtifactTab;
  copied: boolean;
  hasDownload: boolean;
  onVersionChange: (ver: string) => void;
  onTabChange: (next: AiArtifactTab) => void;
  onCopyClick: () => void;
  onDownloadClick: () => void;
}

const ArtifactToolbar = (p: ToolbarProps) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-between gap-2 border-b border-solid border-border/80 bg-secondary/45",
      p.variant === "compact" ? "px-3.5 py-2" : "px-4 py-2.5",
    )}
  >
    <div className="flex min-w-0 items-center gap-2">
      <span className="inline-flex size-6.5 shrink-0 items-center justify-center rounded-lg border border-solid border-border/75 bg-card text-foreground shadow-2xs">
        <Sparkles aria-hidden="true" className="size-3.5 text-signal" />
      </span>
      <span className="truncate font-mono text-xs font-semibold text-foreground">{p.title}</span>
      <VersionSwitcher
        activeVersion={p.activeVersion}
        versions={p.versions}
        onVersionChange={p.onVersionChange}
      />
    </div>
    <div className="flex items-center gap-1.5">
      {p.variant !== "split" && <TabToggleButtons tab={p.tab} onTabChange={p.onTabChange} />}
      <button
        type="button"
        aria-label={p.copied ? "已复制源码" : "复制源码"}
        onClick={p.onCopyClick}
        className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border border-solid border-border/85 bg-card px-2.5 font-sans text-[11px] font-medium text-foreground shadow-2xs transition-colors hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {p.copied ? (
          <Check aria-hidden="true" className="size-3 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Copy aria-hidden="true" className="size-3 text-muted-foreground" />
        )}
        <span>{p.copied ? "已复制" : "复制"}</span>
      </button>
      {p.hasDownload && (
        <button
          type="button"
          aria-label="下载源码"
          onClick={p.onDownloadClick}
          className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full border border-solid border-border/85 bg-card text-muted-foreground shadow-2xs transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Download aria-hidden="true" className="size-3" />
        </button>
      )}
    </div>
  </div>
);

const ObsidianCodePane = ({
  language,
  code,
  showLineNumbers,
}: {
  language: string;
  code: string;
  showLineNumbers: boolean;
}) => {
  const lines = code.split("\n");
  return (
    <div className="[color-scheme:dark] relative flex flex-col bg-zinc-950 text-zinc-100">
      <div className="flex items-center justify-between gap-2 border-b border-solid border-zinc-800/85 bg-zinc-900/75 px-4 py-1.5">
        <span className="font-mono text-[10px] font-medium text-zinc-400">
          {lines.length} 行源码
        </span>
        <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-300 uppercase">
          {language}
        </span>
      </div>
      <pre className="m-0 overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-100">
        <code className="flex flex-col gap-0.5">
          {lines.map((line, idx) => (
            <span key={idx} className="flex gap-3">
              {showLineNumbers && (
                <span
                  aria-hidden="true"
                  className="w-5 shrink-0 select-none text-right text-zinc-400 tabular-nums"
                >
                  {idx + 1}
                </span>
              )}
              <span className="min-w-0 flex-1 whitespace-pre-wrap break-all">{line || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
};

const PreviewPane = ({
  preview,
  previewSurface,
}: {
  preview: AiArtifactProps["preview"];
  previewSurface: AiArtifactPreviewSurface;
}) => (
  <div
    className={cn(
      "relative flex min-h-44 items-center justify-center overflow-hidden p-6",
      ARTIFACT_PREVIEW_SURFACE[previewSurface],
    )}
  >
    {preview}
  </div>
);

const ArtifactStage = ({
  variant,
  tab,
  preview,
  previewSurface,
  language,
  code,
  showLineNumbers,
}: {
  variant: AiArtifactVariant;
  tab: AiArtifactTab;
  preview: AiArtifactProps["preview"];
  previewSurface: AiArtifactPreviewSurface;
  language: string;
  code: string;
  showLineNumbers: boolean;
}) => {
  if (variant === "split") {
    return (
      <div className="grid grid-cols-1 divide-y divide-border/80 md:grid-cols-2 md:divide-x md:divide-y-0">
        <PreviewPane preview={preview} previewSurface={previewSurface} />
        <ObsidianCodePane language={language} code={code} showLineNumbers={showLineNumbers} />
      </div>
    );
  }
  return tab === "preview" ? (
    <PreviewPane preview={preview} previewSurface={previewSurface} />
  ) : (
    <ObsidianCodePane language={language} code={code} showLineNumbers={showLineNumbers} />
  );
};

const useCopyFeedback = (code: string, onCopy?: (code: string) => void) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
  const triggerCopy = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    onCopy?.(code);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCopied(false);
    }, 1500);
  };
  return { copied, triggerCopy };
};

export const AiArtifact = (props: AiArtifactProps) => {
  const variant = props.variant ?? "card";
  const initialVersion =
    props.versions?.[props.versions.length - 1] ?? props.version ?? "v2 · React 19";
  const [tab, setTab] = useState<AiArtifactTab>(props.defaultTab ?? "preview");
  const [activeVersion, setActiveVersion] = useState(initialVersion);
  const { copied, triggerCopy } = useCopyFeedback(props.code, props.onCopy);

  return (
    <div
      data-slot="ai-artifact"
      data-variant={variant}
      className={cn(artifactShellVariants({ variant }), props.className)}
    >
      <ArtifactToolbar
        title={props.title}
        variant={variant}
        activeVersion={activeVersion}
        versions={props.versions}
        tab={tab}
        copied={copied}
        hasDownload={Boolean(props.onDownload)}
        onVersionChange={(ver) => {
          setActiveVersion(ver);
          props.onVersionChange?.(ver);
        }}
        onTabChange={(next) => {
          setTab(next);
          props.onTabChange?.(next);
        }}
        onCopyClick={triggerCopy}
        onDownloadClick={() => props.onDownload?.(props.code)}
      />
      <ArtifactStage
        variant={variant}
        tab={tab}
        preview={props.preview}
        previewSurface={props.previewSurface ?? "grid"}
        language={props.language ?? "tsx"}
        code={props.code}
        showLineNumbers={props.showLineNumbers ?? true}
      />
    </div>
  );
};
