"use client";

/**
 * AiArtifact：智能生成产物独立画布，支持多版本切换、语法高亮源码与实时交互预览。
 */
import { cn } from "@matt-ui/utils";
import { useEffect, useRef, useState } from "react";
import { highlightCodeLine } from "./ai-artifact.highlight.js";
import { ArtifactToolbar } from "./ai-artifact.parts.js";
import type {
  AiArtifactPreviewSurface,
  AiArtifactProps,
  AiArtifactTab,
  AiArtifactVariant,
} from "./ai-artifact.types.js";
import { ARTIFACT_PREVIEW_SURFACE, artifactShellVariants } from "./ai-artifact.variants.js";

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
