// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiArtifact：智能生成产物独立画布，支持多版本切换、语法高亮源码与实时交互预览。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Check, Code2, Copy, Download, Eye, FileCode2 } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

export const artifactShellVariants = cva(
  "w-full overflow-hidden rounded-xl border border-solid shadow-xs",
  {
    variants: {
      obsidian: {
        false: "border-border bg-card text-card-foreground dark:border-white/10",
        true: "[color-scheme:dark] border-zinc-800 bg-zinc-950 text-zinc-100",
      },
    },
    defaultVariants: {
      obsidian: false,
    },
  },
);

export const ARTIFACT_PREVIEW_SURFACE: Record<AiArtifactPreviewSurface, string> = {
  plain: "bg-card",
  grid: "bg-muted/20 bg-[radial-gradient(color-mix(in_srgb,var(--ui-foreground)_12%,transparent)_1px,transparent_1px)] [background-size:16px_16px] dark:bg-zinc-950/50 dark:bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
  obsidian: "bg-zinc-950 text-zinc-100",
};
export type AiArtifactTab = "preview" | "code";
export type AiArtifactVariant = "card" | "split" | "compact";
export type AiArtifactPreviewSurface = "plain" | "grid" | "obsidian";

export interface AiArtifactProps {
  /** 产物标题 */
  title: string;
  /** 容器布局形态：页签切换（card）、分栏对照（split）或紧凑卡片（compact） */
  variant?: AiArtifactVariant;
  /** 预览画布底纹：纯净底面（plain）、微点阵网格（grid）或暗色曜石（obsidian） */
  previewSurface?: AiArtifactPreviewSurface;
  /** 版本与栈标签 */
  version?: string;
  /** 可选多版本切换列表 */
  versions?: string[];
  /** 代码语言标识 */
  language?: string;
  /** 是否在源码视图显示行号 */
  showLineNumbers?: boolean;
  /** 完整源码文本 */
  code: string;
  /** 实时渲染的预览内容 */
  preview?: ReactNode;
  /** 初始展示的页签 */
  defaultTab?: AiArtifactTab;
  /** 切换版本回调 */
  onVersionChange?: (version: string) => void;
  /** 切换页签回调 */
  onTabChange?: (tab: AiArtifactTab) => void;
  /** 复制源码回调 */
  onCopy?: (code: string) => void;
  /** 可选下载源码回调（传入时在工具栏显示下载按钮） */
  onDownload?: (code: string) => void;
  /** 自定义类名 */
  className?: string;
}
type HighlightKind = "comment" | "string" | "tag" | "keyword" | "attr" | "number" | "punct";

const HIGHLIGHT_LIGHT_CLASS: Record<HighlightKind, string> = {
  comment: "italic text-zinc-600 dark:text-zinc-400",
  string: "text-emerald-700 dark:text-emerald-300",
  tag: "text-sky-700 dark:text-sky-300",
  keyword: "font-medium text-violet-700 dark:text-violet-300",
  attr: "text-amber-800 dark:text-amber-300",
  number: "text-rose-700 dark:text-rose-300",
  punct: "text-zinc-600 dark:text-zinc-400",
};

const HIGHLIGHT_OBSIDIAN_CLASS: Record<HighlightKind, string> = {
  comment: "italic text-zinc-400",
  string: "text-emerald-300",
  tag: "text-sky-300",
  keyword: "font-medium text-violet-300",
  attr: "text-amber-300",
  number: "text-rose-300",
  punct: "text-zinc-400",
};

const HIGHLIGHT_KINDS: HighlightKind[] = [
  "comment",
  "string",
  "tag",
  "keyword",
  "attr",
  "number",
  "punct",
];

const HIGHLIGHT_REGEX =
  /(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(--[a-zA-Z0-9-]+|<\/?[A-Za-z][A-Za-z0-9.-]*|\b[A-Z][A-Za-z0-9]*\b)|\b(export|import|from|default|const|let|var|function|return|type|interface|if|else|true|false|null|undefined|async|await|new)\b|(\b[a-z][a-zA-Z0-9-]*)(?=\s*[=:])|(\b\d+(?:\.\d+)?(?:px|rem|em|%|ms|s|K|M)?\b)|(\/>|[{}()[\];,])/g;

const resolveMatchKind = (match: RegExpExecArray): HighlightKind => {
  for (let i = 0; i < HIGHLIGHT_KINDS.length; i += 1) {
    if (match[i + 1] !== undefined) return HIGHLIGHT_KINDS[i] ?? "punct";
  }
  return "punct";
};

const highlightCodeLine = (line: string, obsidian: boolean): ReactNode => {
  if (!line) return " ";
  const palette = obsidian ? HIGHLIGHT_OBSIDIAN_CLASS : HIGHLIGHT_LIGHT_CLASS;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  HIGHLIGHT_REGEX.lastIndex = 0;

  let match = HIGHLIGHT_REGEX.exec(line);
  while (match !== null) {
    if (match.index > cursor) {
      nodes.push(line.slice(cursor, match.index));
    }
    const kind = resolveMatchKind(match);
    nodes.push(
      <span key={match.index} className={palette[kind]}>
        {match[0]}
      </span>,
    );
    cursor = match.index + match[0].length;
    match = HIGHLIGHT_REGEX.exec(line);
  }

  if (cursor < line.length) {
    nodes.push(line.slice(cursor));
  }
  return nodes;
};
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

interface ArtifactToolbarProps {
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

const ArtifactToolbar = (p: ArtifactToolbarProps) => {
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
const CodePane = ({
  lines,
  showLineNumbers,
  obsidian,
}: {
  lines: string[];
  showLineNumbers: boolean;
  obsidian: boolean;
}) => (
  <div
    className={cn(
      "flex h-full min-h-52 flex-col",
      obsidian
        ? "bg-zinc-950 text-zinc-100"
        : "bg-zinc-50/80 text-zinc-800 dark:bg-zinc-950/90 dark:text-zinc-100",
    )}
  >
    <pre className="m-0 flex-1 overflow-x-auto py-3.5 font-mono text-xs leading-6">
      <code className="flex min-w-max flex-col">
        {lines.map((line, idx) => (
          <span
            key={idx}
            className={cn(
              "flex items-baseline px-4 transition-colors",
              obsidian ? "hover:bg-white/[0.03]" : "hover:bg-foreground/[0.03]",
            )}
          >
            {showLineNumbers && (
              <span
                aria-hidden="true"
                className={cn(
                  "mr-4 w-7 shrink-0 select-none border-r border-solid pr-3 text-right text-[11px] tabular-nums",
                  obsidian
                    ? "border-zinc-800/90 text-zinc-400"
                    : "border-border/70 text-zinc-600 dark:border-white/10 dark:text-zinc-400",
                )}
              >
                {idx + 1}
              </span>
            )}
            {line && <span className="sr-only select-none">{line}</span>}
            <span aria-hidden="true" className="whitespace-pre">
              {highlightCodeLine(line, obsidian)}
            </span>
          </span>
        ))}
      </code>
    </pre>
  </div>
);

const PreviewPane = ({
  preview,
  previewSurface,
}: {
  preview: AiArtifactProps["preview"];
  previewSurface: AiArtifactPreviewSurface;
}) => (
  <div
    className={cn(
      "relative flex h-full min-h-56 items-center justify-center overflow-hidden p-6 sm:p-8",
      ARTIFACT_PREVIEW_SURFACE[previewSurface],
    )}
  >
    {previewSurface === "grid" && (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,color-mix(in_srgb,var(--ui-card)_82%,transparent)_100%)]"
      />
    )}
    <div className="relative z-10 flex w-full items-center justify-center">{preview}</div>
  </div>
);

const ArtifactStage = ({
  variant,
  tab,
  preview,
  previewSurface,
  lines,
  showLineNumbers,
}: {
  variant: AiArtifactVariant;
  tab: AiArtifactTab;
  preview: AiArtifactProps["preview"];
  previewSurface: AiArtifactPreviewSurface;
  lines: string[];
  showLineNumbers: boolean;
}) => {
  const obsidian = previewSurface === "obsidian";
  if (variant === "split") {
    return (
      <div
        className={cn(
          "grid grid-cols-1 items-stretch divide-y md:grid-cols-2 md:divide-x md:divide-y-0",
          obsidian ? "divide-zinc-800" : "divide-border/75 dark:divide-white/10",
        )}
      >
        <PreviewPane preview={preview} previewSurface={previewSurface} />
        <CodePane lines={lines} showLineNumbers={showLineNumbers} obsidian={obsidian} />
      </div>
    );
  }
  return tab === "preview" ? (
    <PreviewPane preview={preview} previewSurface={previewSurface} />
  ) : (
    <CodePane lines={lines} showLineNumbers={showLineNumbers} obsidian={obsidian} />
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
  const previewSurface = props.previewSurface ?? "grid";
  const obsidian = previewSurface === "obsidian";
  const lines = props.code.split("\n");
  const initialVersion =
    props.versions?.[props.versions.length - 1] ?? props.version ?? "v2 · React 19";
  const [tab, setTab] = useState<AiArtifactTab>(props.defaultTab ?? "preview");
  const [activeVersion, setActiveVersion] = useState(initialVersion);
  const { copied, triggerCopy } = useCopyFeedback(props.code, props.onCopy);

  return (
    <div
      data-slot="ai-artifact"
      data-variant={variant}
      className={cn(artifactShellVariants({ obsidian }), props.className)}
    >
      <ArtifactToolbar
        title={props.title}
        variant={variant}
        obsidian={obsidian}
        activeVersion={activeVersion}
        versions={props.versions}
        language={props.language ?? "tsx"}
        lineCount={lines.length}
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
        previewSurface={previewSurface}
        lines={lines}
        showLineNumbers={props.showLineNumbers ?? true}
      />
    </div>
  );
};
