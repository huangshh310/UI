// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
  FileCode2,
  Terminal,
  Wrench,
} from "lucide-react";
import { useState } from "react";

export const aiStackTraceContainerVariants = cva("w-full text-foreground", {
  variants: {
    variant: {
      card: "rounded-2xl border border-border bg-card/95 p-4 shadow-sm sm:p-5",
      seamless: "bg-transparent p-0",
    },
  },
  defaultVariants: {
    variant: "card",
  },
});

export const STACK_DEFAULT_COMMAND: AiStackCommand = {
  command: "curl -sf localhost:3000/api/users",
  exitCode: 22,
  duration: "1.8s",
};

export const STACK_DEFAULT_FRAMES: AiStackFrame[] = [
  {
    id: "f-undici",
    location: "node:internal/deps/undici/undici:13510:13",
  },
  {
    id: "f-users",
    fn: "async getUsers",
    location: "lib/users.ts:10:26",
    snippet: {
      file: "lib/users.ts",
      lines: [
        {
          lineNumber: 7,
          content: 'const ACCOUNTS_URL = process.env.ACCOUNTS_URL ?? "http://127.0.0.1:8787";',
        },
        { lineNumber: 8, content: "" },
        { lineNumber: 9, content: "export async function getUsers(): Promise<User[]> {" },
        {
          lineNumber: 10,
          content: "  const response = await fetch(`${ACCOUNTS_URL}/users`, {",
          highlight: true,
        },
        { lineNumber: 11, content: "    next: { revalidate: 60 }," },
        { lineNumber: 12, content: "  });" },
        { lineNumber: 13, content: "  const rows: UserRow[] = await response.json();" },
        { lineNumber: 14, content: "  return rows.map(toUser);" },
        { lineNumber: 15, content: "}" },
      ],
    },
  },
  {
    id: "f-route",
    fn: "async GET",
    location: "app/api/users/route.ts:8:17",
  },
  {
    id: "f-fw-1",
    fn: "AppRouteRouteModule.do",
    location: "next/dist/server/route-modules/app-route/module.js:412:21",
    framework: true,
    frameworkLabel: "next",
  },
  {
    id: "f-fw-2",
    fn: "AppRouteRouteModule.handle",
    location: "next/dist/server/route-modules/app-route/module.js:518:30",
    framework: true,
    frameworkLabel: "next",
  },
  {
    id: "f-fw-3",
    fn: "NextNodeServer.handleCatchallRenderRequest",
    location: "next/dist/server/next-server.js:304:19",
    framework: true,
    frameworkLabel: "next",
  },
];

export const STACK_DEFAULT_CAUSE: AiStackCause = {
  name: "Error",
  code: "ECONNREFUSED",
  message: "connect ECONNREFUSED 127.0.0.1:8787",
};
export type AiStackTraceVariant = "card" | "seamless";

export interface AiStackCommand {
  /** 执行的命令文本 */
  command: string;
  /** 退出码（非 0 显示红色 exit N） */
  exitCode?: number;
  /** 执行耗时（如 1.8s） */
  duration?: string;
}

export interface AiStackCodeLine {
  lineNumber: number;
  content: string;
  highlight?: boolean;
}

export interface AiStackCodeSnippet {
  file: string;
  lines: AiStackCodeLine[];
}

export interface AiStackFrame {
  id: string;
  /** 函数名（可选，如 async getUsers） */
  fn?: string;
  /** 文件与行列位置（如 lib/users.ts:10:26） */
  location: string;
  /** 是否属于框架/运行时内部帧（默认折叠归组） */
  framework?: boolean;
  /** 框架名分组标识（如 next） */
  frameworkLabel?: string;
  /** 内嵌源码上下文预览 */
  snippet?: AiStackCodeSnippet;
}

export interface AiStackCause {
  name: string;
  code?: string;
  message: string;
}

export interface AiStackTraceProps {
  /** 可选顶部命令执行摘要行（如 Ran curl -sf ... exit 22） */
  command?: AiStackCommand | null;
  /** 错误类型名（如 TypeError） */
  errorName?: string;
  /** 错误消息（如 fetch failed） */
  errorMessage?: string;
  /** 调用栈帧列表 */
  frames?: AiStackFrame[];
  /** 折叠框架帧总数提示（默认按 framework 帧数计算） */
  frameworkFrameCount?: number;
  /** 框架分组标签（如 next） */
  frameworkGroupLabel?: string;
  /** 底层根因链（Caused by） */
  cause?: AiStackCause | null;
  /** 是否默认展开堆栈卡片，默认 true */
  defaultOpen?: boolean;
  /** 容器风格：card 或 seamless */
  variant?: AiStackTraceVariant;
  /** 点击“请求修复”回调 */
  onAskFix?: (payload: { name: string; message: string }) => void;
  /** 点击复制堆栈回调 */
  onCopy?: (rawTrace: string) => void;
  /** 自定义类名 */
  className?: string;
}
function SnippetCodeLine({ line }: { line: AiStackCodeSnippet["lines"][number] }) {
  return (
    <div
      className={cn(
        "flex items-start px-3 py-0.5",
        line.highlight ? "bg-rose-500/12 text-foreground" : "text-foreground",
      )}
    >
      <span
        className={cn(
          "mr-4 w-6 shrink-0 select-none text-right tabular-nums",
          line.highlight
            ? "font-semibold text-rose-800 dark:text-rose-300"
            : "text-muted-foreground",
        )}
      >
        {line.lineNumber}
      </span>
      <span className="min-w-0 whitespace-pre-wrap break-all">{line.content || " "}</span>
    </div>
  );
}

function StackCodeSnippet({ snippet }: { snippet: AiStackCodeSnippet }) {
  const [copied, setCopied] = useState(false);
  const handleCopySnippet = () => {
    const code = snippet.lines.map((l) => l.content).join("\n");
    navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-border/80 bg-background">
      <div className="flex items-center justify-between gap-2 border-b border-border/70 px-3 py-1.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <FileCode2 className="size-3.5 shrink-0" aria-hidden="true" />
          {snippet.file}
        </span>
        <button
          type="button"
          onClick={handleCopySnippet}
          aria-label={`复制 ${snippet.file} 代码片段`}
          className="inline-flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-700 dark:text-emerald-300" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
      <div className="py-1.5 font-mono text-[11.5px] leading-5">
        {snippet.lines.map((line) => (
          <SnippetCodeLine key={line.lineNumber} line={line} />
        ))}
      </div>
    </div>
  );
}

function FrameworkFramesToggle({
  frames,
  count,
  label,
}: {
  frames: AiStackFrame[];
  count: number;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  if (frames.length === 0) return null;

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-md py-0.5 font-mono text-[11.5px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        <span>{count} 个框架帧</span>
        <span>{label}</span>
      </button>

      {open ? (
        <div className="mt-1.5 ml-2 space-y-1 border-l border-border/70 pl-3 font-mono text-[11px] text-muted-foreground">
          {frames.map((frame) => (
            <div key={frame.id} className="truncate">
              {frame.fn ? <span className="mr-2 text-foreground">{frame.fn}</span> : null}
              <span>{frame.location}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StackCauseFooter({ cause }: { cause: AiStackCause }) {
  return (
    <div className="border-t border-border/70 bg-muted/35 px-4 py-3 font-mono text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground">Caused by</span>
        <span className="font-semibold text-foreground">{cause.name}</span>
        {cause.code ? (
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground">
            {cause.code}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-muted-foreground">{cause.message}</p>
    </div>
  );
}
function CommandHeader({
  command,
  open,
  onToggle,
}: {
  command: AiStackCommand;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-3 text-xs">
      <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
        <Terminal className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="shrink-0">已执行</span>
        <code className="truncate font-mono text-[11.5px] text-foreground/85">
          {command.command}
        </code>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {typeof command.exitCode === "number" ? (
          <span
            className={cn(
              "font-mono text-[11px] font-medium",
              command.exitCode === 0
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-rose-700 dark:text-rose-300",
            )}
          >
            exit {command.exitCode}
          </span>
        ) : null}
        {command.duration ? (
          <span className="tabular-nums text-[11px] text-muted-foreground">{command.duration}</span>
        ) : null}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={open ? "折叠错误堆栈" : "展开错误堆栈"}
          className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}

function FrameRow({ frame }: { frame: AiStackFrame }) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-baseline gap-x-2 font-mono text-[11.5px] leading-relaxed">
        {frame.fn ? <span className="font-medium text-foreground">{frame.fn}</span> : null}
        <span className="break-all text-muted-foreground">{frame.location}</span>
      </div>
      {frame.snippet ? <StackCodeSnippet snippet={frame.snippet} /> : null}
    </div>
  );
}

function TraceCardHeader(p: {
  errorName: string;
  errorMessage: string;
  copied: boolean;
  onAskFix: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 px-4 py-3">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <AlertCircle className="size-4 shrink-0 text-destructive" aria-hidden="true" />
          <span className="font-medium text-muted-foreground">失败</span>
          <span className="font-mono font-semibold text-foreground">{p.errorName}</span>
        </div>
        <p className="pl-6 text-[13px] font-medium text-foreground">{p.errorMessage}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={p.onAskFix}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Wrench className="size-3.5 text-muted-foreground" aria-hidden="true" />
          请求修复
        </button>
        <button
          type="button"
          onClick={p.onCopy}
          aria-label="复制错误堆栈"
          className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {p.copied ? (
            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

function formatRawTrace(
  name: string,
  message: string,
  frames: AiStackFrame[],
  cause?: AiStackCause | null,
) {
  const causeLine = cause
    ? [`Caused by ${cause.name}${cause.code ? ` ${cause.code}` : ""}: ${cause.message}`]
    : [];
  return [
    `${name}: ${message}`,
    ...frames.map((f) => `  at ${f.fn ? `${f.fn} ` : ""}${f.location}`),
    ...causeLine,
  ].join("\n");
}

const DEFAULT_STACK_CFG = {
  command: STACK_DEFAULT_COMMAND as AiStackCommand | null,
  errorName: "TypeError",
  errorMessage: "fetch failed",
  frames: STACK_DEFAULT_FRAMES,
  frameworkGroupLabel: "next",
  cause: STACK_DEFAULT_CAUSE as AiStackCause | null,
  defaultOpen: true,
  variant: "card" as const,
};

/**
 * AI 错误堆栈与源码上下文排查面板，对标 HextaUI Stack Trace：
 * 支持命令退出码条、一键“请求修复”、高亮出错源码行、框架帧折叠归组与 Caused by 根因链。
 */
export function AiStackTrace(props: AiStackTraceProps) {
  const cfg = { ...DEFAULT_STACK_CFG, ...props };
  const [open, setOpen] = useState(cfg.defaultOpen);
  const [copied, setCopied] = useState(false);

  const appFrames = cfg.frames.filter((f) => !f.framework);
  const fwFrames = cfg.frames.filter((f) => f.framework);
  const fwCount =
    props.frameworkFrameCount ?? (cfg.frames === STACK_DEFAULT_FRAMES ? 8 : fwFrames.length);

  const handleCopyTrace = () => {
    const text = formatRawTrace(cfg.errorName, cfg.errorMessage, cfg.frames, cfg.cause);
    props.onCopy?.(text);
    navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={cn(aiStackTraceContainerVariants({ variant: cfg.variant }), props.className)}>
      {cfg.command ? (
        <CommandHeader command={cfg.command} open={open} onToggle={() => setOpen((v) => !v)} />
      ) : null}
      {open ? (
        <div className="overflow-hidden rounded-xl border border-border/85 bg-card">
          <TraceCardHeader
            errorName={cfg.errorName}
            errorMessage={cfg.errorMessage}
            copied={copied}
            onAskFix={() => props.onAskFix?.({ name: cfg.errorName, message: cfg.errorMessage })}
            onCopy={handleCopyTrace}
          />
          <div className="space-y-2 px-4 py-3">
            {appFrames.map((frame) => (
              <FrameRow key={frame.id} frame={frame} />
            ))}
            <FrameworkFramesToggle
              frames={fwFrames}
              count={fwCount}
              label={cfg.frameworkGroupLabel}
            />
          </div>
          {cfg.cause ? <StackCauseFooter cause={cfg.cause} /> : null}
        </div>
      ) : null}
    </div>
  );
}
