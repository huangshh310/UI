"use client";

/**
 * AiAgentActivity 内部状态图标与明细抽屉子部件。
 */
import { cn } from "@matt-ui/utils";
import { AlertCircle, Check, Pause, RotateCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { AiAgentActivityDetails, AiAgentActivityStatus } from "./ai-agent-activity.types.js";

export const ACTIVITY_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 32,
  mass: 0.6,
};

export const ActivityStatusGlyph = ({ status }: { status: AiAgentActivityStatus }) => {
  if (status === "running") {
    return (
      <RotateCw
        aria-hidden="true"
        className="size-3 animate-spin text-foreground motion-reduce:animate-none"
      />
    );
  }
  if (status === "error") {
    return <AlertCircle aria-hidden="true" className="size-3.5 text-destructive" />;
  }
  if (status === "cancelled") {
    return <Pause aria-hidden="true" className="size-3 text-muted-foreground" />;
  }
  if (status === "success") {
    return (
      <Check
        aria-hidden="true"
        className="size-3 stroke-[2.5] text-emerald-600 dark:text-emerald-400"
      />
    );
  }
  return <span aria-hidden="true" className="size-1.5 rounded-full bg-border" />;
};

export const statusCircleClass = (status: AiAgentActivityStatus) => {
  if (status === "running") {
    return "border border-solid border-border bg-card ring-2 ring-emerald-500/20";
  }
  if (status === "success") return "bg-emerald-500/12 dark:bg-emerald-500/18";
  if (status === "error") return "bg-destructive/12";
  return "border border-solid border-border bg-card";
};

const formatPayload = (value: string | Record<string, unknown>) =>
  typeof value === "string" ? value : JSON.stringify(value, null, 2);

const PayloadBlock = ({
  label,
  body,
  mono = false,
}: {
  label: string;
  body: string;
  mono?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
    <pre
      className={cn(
        "m-0 overflow-x-auto rounded-xl border border-solid border-border/70 bg-secondary/55 p-2.5 text-xs leading-relaxed text-foreground select-text",
        mono ? "font-mono" : "font-sans whitespace-pre-wrap",
      )}
    >
      <code>{body}</code>
    </pre>
  </div>
);

const MetadataChips = ({ metadata }: { metadata?: Record<string, string | number | boolean> }) => {
  const entries = metadata ? Object.entries(metadata) : [];
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 pt-0.5">
      {entries.map(([k, v]) => (
        <span
          key={k}
          className="inline-flex items-center gap-1 rounded-md border border-solid border-border/70 bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
        >
          <span>{k}:</span>
          <span className="font-medium text-foreground">{String(v)}</span>
        </span>
      ))}
    </div>
  );
};

const DrawerBody = ({
  details,
  metadata,
}: {
  details?: AiAgentActivityDetails;
  metadata?: Record<string, string | number | boolean>;
}) => (
  <div className="flex flex-col gap-2.5 pt-1">
    {details?.input && <PayloadBlock label="调用参数" body={formatPayload(details.input)} mono />}
    {details?.codeSnippet && (
      <PayloadBlock label={details.language || "代码片段"} body={details.codeSnippet} mono />
    )}
    {details?.output && <PayloadBlock label="返回结果" body={formatPayload(details.output)} />}
    <MetadataChips metadata={metadata} />
  </div>
);

export const ActivityDetailsDrawer = ({
  open,
  details,
  metadata,
  reduced,
}: {
  open: boolean;
  details?: AiAgentActivityDetails;
  metadata?: Record<string, string | number | boolean>;
  reduced: boolean | null;
}) => (
  <AnimatePresence initial={false}>
    {open && (details || metadata) && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={reduced ? { duration: 0 } : ACTIVITY_SPRING}
        className="mt-2.5 overflow-hidden border-l border-solid border-border/80 pl-3"
      >
        <DrawerBody details={details} metadata={metadata} />
      </motion.div>
    )}
  </AnimatePresence>
);
