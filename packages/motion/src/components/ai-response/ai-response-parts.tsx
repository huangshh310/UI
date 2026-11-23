"use client";

/**
 * AiResponse 内部视觉子部件：极简状态微标、工具折叠抽屉与参考来源折叠列表。
 */
import { cn } from "@matt-ui/utils";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ExternalLink,
  Link2,
  Loader2,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { hostOf, isExternalHref, safeHref } from "./ai-response-safe.js";
import type { AiResponseSource, AiResponseStatus, AiResponseTool } from "./ai-response.types.js";
import {
  AI_RESPONSE_COLLAPSE_TRANSITION,
  AI_RESPONSE_FOCUS_RING,
  AI_RESPONSE_TRIGGER_BTN,
} from "./ai-response.variants.js";

export const ResponseStatusDot = ({ status }: { status: AiResponseStatus }) => {
  if (status === "error") {
    return <AlertCircle aria-hidden="true" className="size-3.5 shrink-0 text-destructive" />;
  }
  if (status === "generating" || status === "streaming") {
    return (
      <Loader2
        aria-hidden="true"
        className="size-3.5 shrink-0 animate-spin text-signal motion-reduce:animate-none"
      />
    );
  }
  return (
    <span aria-hidden="true" className="inline-flex size-3.5 shrink-0 items-center justify-center">
      <span className="size-1.5 rounded-full bg-muted-foreground/55 dark:bg-white/35" />
    </span>
  );
};

export const ResponseGeneratingSkeleton = ({ label }: { label: string }) => (
  <div className="space-y-2.5 py-1" aria-busy="true">
    <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-muted dark:bg-white/10" />
    <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-muted dark:bg-white/10" />
    <p className="m-0 pt-1 text-xs text-muted-foreground">{label}</p>
  </div>
);

const ToolStatusGlyph = ({ status }: { status: AiResponseTool["status"] }) => {
  if (status === "running") {
    return (
      <Loader2 className="size-3.5 shrink-0 animate-spin text-signal motion-reduce:animate-none" />
    );
  }
  if (status === "error") return <AlertCircle className="size-3.5 shrink-0 text-destructive" />;
  return <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />;
};

const ToolListRow = ({ tool }: { tool: AiResponseTool }) => (
  <li
    className={cn(
      "flex items-center justify-between gap-3 rounded-lg border border-solid px-3 py-2 text-xs",
      tool.status === "error"
        ? "border-destructive/35 bg-destructive/[0.06] dark:border-destructive/50 dark:bg-destructive/12"
        : "border-border/80 bg-muted/35 dark:border-white/10 dark:bg-white/[0.03]",
    )}
  >
    <div className="flex min-w-0 items-center gap-2">
      <ToolStatusGlyph status={tool.status} />
      <span className="truncate font-mono text-[12px] text-foreground">{tool.name}</span>
      {tool.detail && <span className="truncate text-muted-foreground">· {tool.detail}</span>}
    </div>
    {tool.duration && (
      <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
        {tool.duration}
      </span>
    )}
  </li>
);

export const ResponseToolsPanel = ({
  tools,
  defaultOpen = false,
  className,
}: {
  tools: AiResponseTool[];
  defaultOpen?: boolean;
  className?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const reduced = useReducedMotion();
  if (tools.length === 0) return null;

  return (
    <div className={cn("mt-3", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn("-ml-2", AI_RESPONSE_TRIGGER_BTN)}
      >
        <Wrench aria-hidden="true" className="size-3.5 text-muted-foreground/80" />
        <span className="tabular-nums">已调用 {tools.length} 项工具</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 transition-transform duration-(--ui-duration-fast)",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={reduced ? { duration: 0 } : AI_RESPONSE_COLLAPSE_TRANSITION}
            className="m-0 mt-2 list-none space-y-1.5 overflow-hidden p-0"
          >
            {tools.map((tool) => (
              <ToolListRow key={tool.id} tool={tool} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const SourceCardRow = ({
  source,
  cleaned,
  index,
}: {
  source: AiResponseSource;
  cleaned: string;
  index: number;
}) => {
  const external = isExternalHref(cleaned);
  return (
    <li>
      <a
        href={cleaned}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cn(
          "group flex flex-col gap-1 rounded-lg border border-solid border-border/80 bg-muted/30 p-2.5 text-left no-underline transition-colors hover:border-foreground/20 hover:bg-muted/60 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20 dark:hover:bg-white/[0.06]",
          AI_RESPONSE_FOCUS_RING,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-foreground">
            <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-[10px] text-muted-foreground dark:bg-white/10">
              {index + 1}
            </span>
            <span className="truncate">{source.title}</span>
          </span>
          <ExternalLink
            aria-hidden="true"
            className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
          />
        </div>
        {source.snippet && (
          <p className="m-0 line-clamp-1 text-[11px] text-muted-foreground">{source.snippet}</p>
        )}
        <span className="truncate font-mono text-[10px] text-muted-foreground">
          {hostOf(cleaned)}
        </span>
      </a>
    </li>
  );
};

const SourcesAnimatedList = ({
  open,
  reduced,
  items,
}: {
  open: boolean;
  reduced: boolean | null;
  items: { source: AiResponseSource; cleaned: string }[];
}) => (
  <AnimatePresence initial={false}>
    {open && (
      <motion.ol
        initial={reduced ? false : { opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
        transition={reduced ? { duration: 0 } : AI_RESPONSE_COLLAPSE_TRANSITION}
        className="m-0 mt-2 grid list-none gap-2 overflow-hidden p-0 sm:grid-cols-2"
      >
        {items.map((item, index) => (
          <SourceCardRow
            key={item.source.id}
            source={item.source}
            cleaned={item.cleaned}
            index={index}
          />
        ))}
      </motion.ol>
    )}
  </AnimatePresence>
);

export const ResponseSourcesPanel = ({
  sources,
  defaultOpen = false,
  className,
}: {
  sources: AiResponseSource[];
  defaultOpen?: boolean;
  className?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const reduced = useReducedMotion();
  const validSources = sources
    .map((src) => ({ source: src, cleaned: safeHref(src.url) }))
    .filter((item): item is { source: AiResponseSource; cleaned: string } => Boolean(item.cleaned));

  if (validSources.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-3 border-t border-solid border-border/75 pt-2.5 dark:border-white/10",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn("-ml-2", AI_RESPONSE_TRIGGER_BTN)}
      >
        <Link2 aria-hidden="true" className="size-3.5 text-muted-foreground/80" />
        <span className="tabular-nums">参考来源（{validSources.length}）</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 transition-transform duration-(--ui-duration-fast)",
            open && "rotate-180",
          )}
        />
      </button>
      <SourcesAnimatedList open={open} reduced={reduced} items={validSources} />
    </div>
  );
};
