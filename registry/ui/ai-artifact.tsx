// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiArtifact：Claude Artifacts / v0 风格的 AI 生成产物画布，支持版本切换、预览/源码切换与一键复制。
 */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, Code2, Copy, Eye, Sparkles } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

export type AiArtifactTab = "preview" | "code";

export interface AiArtifactProps {
  /** 产物标题 */
  title: string;
  /** 版本与栈标签 */
  version?: string;
  /** 可选多版本切换列表 */
  versions?: string[];
  /** 代码语言标识 */
  language?: string;
  /** 完整源码文本 */
  code: string;
  /** 实时渲染的预览内容 */
  preview: ReactNode;
  /** 初始展示的页签 */
  defaultTab?: AiArtifactTab;
  /** 复制源码回调 */
  onCopy?: (code: string) => void;
  /** 自定义类名 */
  className?: string;
}
const TabToggleButtons = ({
  tab,
  onTabChange,
}: {
  tab: AiArtifactTab;
  onTabChange: (next: AiArtifactTab) => void;
}) => (
  <div className="inline-flex items-center gap-0.5 rounded-full border border-solid border-border/85 bg-secondary/80 p-0.5">
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
    <div className="inline-flex items-center gap-0.5 rounded-md border border-solid border-border bg-card p-0.5">
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

const ArtifactToolbar = ({
  title,
  activeVersion,
  versions,
  tab,
  copied,
  onVersionChange,
  onTabChange,
  onCopyClick,
}: {
  title: string;
  activeVersion: string;
  versions?: string[];
  tab: AiArtifactTab;
  copied: boolean;
  onVersionChange: (ver: string) => void;
  onTabChange: (next: AiArtifactTab) => void;
  onCopyClick: () => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-solid border-border/80 bg-secondary/45 px-4 py-2.5">
    <div className="flex items-center gap-2">
      <span className="inline-flex size-6.5 items-center justify-center rounded-xl bg-gradient-to-br from-signal to-indigo-600 text-signal-foreground shadow-xs">
        <Sparkles aria-hidden="true" className="size-3.5" />
      </span>
      <span className="text-xs font-semibold text-foreground">{title}</span>
      <VersionSwitcher
        activeVersion={activeVersion}
        versions={versions}
        onVersionChange={onVersionChange}
      />
    </div>
    <div className="flex items-center gap-2">
      <TabToggleButtons tab={tab} onTabChange={onTabChange} />
      <button
        type="button"
        aria-label={copied ? "已复制源码" : "复制源码"}
        onClick={onCopyClick}
        className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border border-solid border-border bg-card px-2.5 font-sans text-[11px] font-medium text-foreground shadow-xs transition-colors hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copied ? (
          <Check aria-hidden="true" className="size-3 text-signal" />
        ) : (
          <Copy aria-hidden="true" className="size-3 text-muted-foreground" />
        )}
        <span>{copied ? "已复制" : "复制"}</span>
      </button>
    </div>
  </div>
);

const ArtifactBody = ({
  tab,
  preview,
  language,
  code,
}: {
  tab: AiArtifactTab;
  preview: AiArtifactProps["preview"];
  language: string;
  code: string;
}) =>
  tab === "preview" ? (
    <div className="relative flex min-h-40 items-center justify-center overflow-hidden bg-gradient-to-b from-signal/[0.04] to-transparent p-5">
      {preview}
    </div>
  ) : (
    <div className="relative bg-secondary/35 p-4">
      <span className="absolute top-2.5 right-3 rounded-md bg-card/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground uppercase">
        {language}
      </span>
      <pre className="m-0 border-l-2 border-solid border-signal/50 pl-3 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );

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

export const AiArtifact = ({
  title,
  version = "v2 · React 19",
  versions,
  language = "tsx",
  code,
  preview,
  defaultTab = "preview",
  onCopy,
  className,
}: AiArtifactProps) => {
  const [tab, setTab] = useState<AiArtifactTab>(defaultTab);
  const [activeVersion, setActiveVersion] = useState(versions?.[versions.length - 1] ?? version);
  const { copied, triggerCopy } = useCopyFeedback(code, onCopy);

  return (
    <div
      data-slot="ai-artifact"
      className={cn(
        "w-full max-w-xl overflow-hidden rounded-[22px] border border-solid border-border/90 bg-card text-card-foreground shadow-md",
        className,
      )}
    >
      <ArtifactToolbar
        title={title}
        activeVersion={activeVersion}
        versions={versions}
        tab={tab}
        copied={copied}
        onVersionChange={setActiveVersion}
        onTabChange={setTab}
        onCopyClick={triggerCopy}
      />
      <ArtifactBody tab={tab} preview={preview} language={language} code={code} />
    </div>
  );
};
