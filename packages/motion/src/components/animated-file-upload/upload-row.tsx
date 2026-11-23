"use client";

/**
 * AnimatedFileUpload 单行文件卡片：缩略图/图标、状态文案、体积、重试/移除操作与底部 2px 进度条。
 */
import { cn } from "@matt-ui/utils";
import {
  CheckCircle2,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  RotateCw,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import type { UploadFileItem } from "./animated-file-upload.types.js";
import { formatFileSize } from "./upload-helpers.js";

const ROW_ACTION_CLASSES =
  "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const FilePreview = ({ item }: { item: UploadFileItem }) => {
  if (item.previewUrl) {
    return (
      <img
        src={item.previewUrl}
        alt=""
        className="size-9 shrink-0 rounded-lg border border-solid border-border/80 object-cover dark:border-white/12"
      />
    );
  }
  const Icon = item.type.startsWith("image/")
    ? ImageIcon
    : item.type.includes("text") || item.type.includes("pdf")
      ? FileText
      : FileIcon;
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-solid border-border/80 bg-secondary/70 text-muted-foreground dark:border-white/10"
    >
      <Icon className="size-4" />
    </span>
  );
};

const statusLabel = (item: UploadFileItem) => {
  if (item.status === "uploading") return `上传中 ${Math.round(item.progress)}%`;
  if (item.status === "success") return "已上传";
  if (item.status === "error") return item.error ?? "上传失败";
  return "已就绪";
};

const RowInfo = ({ item }: { item: UploadFileItem }) => (
  <div className="min-w-0 flex-1">
    <p className="m-0 truncate text-[13px] font-medium text-foreground">{item.name}</p>
    <p
      className={cn(
        "m-0 mt-0.5 flex items-center gap-1 text-xs",
        item.status === "error" ? "text-destructive" : "text-muted-foreground",
      )}
    >
      {item.status === "success" && (
        <CheckCircle2 aria-hidden="true" className="size-3.5 shrink-0 text-emerald-500" />
      )}
      <span className="truncate">{statusLabel(item)}</span>
    </p>
  </div>
);

const RowActions = ({
  item,
  onRemove,
  onRetry,
}: {
  item: UploadFileItem;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}) => (
  <div className="flex shrink-0 items-center gap-0.5">
    {item.status === "error" && (
      <button
        type="button"
        aria-label={`重试 ${item.name}`}
        onClick={() => onRetry(item.id)}
        className={ROW_ACTION_CLASSES}
      >
        <RotateCw aria-hidden="true" className="size-3.5" />
      </button>
    )}
    <button
      type="button"
      aria-label={`移除 ${item.name}`}
      onClick={() => onRemove(item.id)}
      className={ROW_ACTION_CLASSES}
    >
      <X aria-hidden="true" className="size-3.5" />
    </button>
  </div>
);

const RowProgress = ({ progress, reduceMotion }: { progress: number; reduceMotion: boolean }) => (
  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-secondary">
    <motion.span
      className="block h-full bg-signal"
      initial={false}
      animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
    />
  </span>
);

export const UploadRow = ({
  item,
  reduceMotion,
  onRemove,
  onRetry,
}: {
  item: UploadFileItem;
  reduceMotion: boolean;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}) => (
  <motion.li
    layout={!reduceMotion}
    initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 12, scale: 0.98 }}
    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 32 }}
    data-slot="upload-file-row"
    data-status={item.status}
    className={cn(
      "relative flex items-center gap-3 overflow-hidden rounded-xl border border-solid border-border/80 bg-card px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/10",
      item.status === "error" && "border-destructive/65 bg-destructive/6 dark:border-destructive",
    )}
  >
    <FilePreview item={item} />
    <RowInfo item={item} />
    <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
      {formatFileSize(item.size)}
    </span>
    <RowActions item={item} onRemove={onRemove} onRetry={onRetry} />
    {item.status === "uploading" && (
      <RowProgress progress={item.progress} reduceMotion={reduceMotion} />
    )}
  </motion.li>
);
