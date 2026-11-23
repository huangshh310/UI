// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AnimatedFileUpload：支持拖拽高光、紧凑模式、文件校验、缩略图预览与适配器上传进度的动效上传组件。
 * 交互基于原生 <input type="file"> 与 HTML Drag & Drop；拖拽图标上浮与文件列表进出场由 motion 驱动。
 */

import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  RotateCw,
  UploadCloud,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from "react";

export const DROPZONE_BASE =
  "group relative flex w-full cursor-pointer border font-sans transition-[border-color,background-color,box-shadow,transform] duration-(--ui-duration-fast) outline-none active:scale-[0.995] focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-dragging:border-signal data-dragging:bg-signal/6 disabled:pointer-events-none disabled:opacity-50";

export const DROPZONE_VARIANT_CLASSES: Record<AnimatedFileUploadVariant, string> = {
  default:
    "border-dashed border-input/65 bg-background/80 hover:border-foreground/30 hover:bg-card dark:border-white/14 dark:bg-card/60 dark:hover:border-white/25",
  filled:
    "border-solid border-transparent bg-secondary/70 hover:bg-secondary dark:bg-white/7 dark:hover:bg-white/11",
  minimal:
    "border-solid border-border/85 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/25 dark:border-white/12 dark:hover:border-white/22",
};

export const DROPZONE_LAYOUT_CLASSES = {
  regular: "min-h-[168px] flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center",
  compact:
    "min-h-14 flex-row items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left",
};

export const DROPZONE_INVALID_CLASSES =
  "border-destructive hover:border-destructive focus-visible:border-destructive focus-visible:ring-destructive dark:border-destructive dark:hover:border-destructive";

export const DROPZONE_ICON_CLASSES =
  "inline-flex shrink-0 items-center justify-center rounded-xl border border-solid border-border/80 bg-background text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-(--ui-duration-fast) group-hover:text-foreground dark:border-white/12 dark:bg-card";
export type UploadFileStatus = "ready" | "uploading" | "success" | "error";
export type AnimatedFileUploadVariant = "default" | "filled" | "minimal";

export interface UploadFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  status: UploadFileStatus;
  progress: number;
  error?: string;
}

export interface UploadAdapterHelpers {
  onProgress: (percent: number) => void;
  signal: AbortSignal;
}

/** 外部注入的上传适配器，使组件不绑定任何具体云存储或后端协议 */
export type UploadAdapter = (file: File, helpers: UploadAdapterHelpers) => Promise<void>;

export interface AnimatedFileUploadProps {
  /** 允许的 MIME 类型或扩展名（与原生 accept 语义一致，逗号分隔） */
  accept?: string;
  /** 是否允许多选 */
  multiple?: boolean;
  /** 单文件最大字节数 */
  maxSize?: number;
  /** 最多允许保留的文件数 */
  maxFiles?: number;
  disabled?: boolean;
  /** 拖拽区视觉风格 */
  variant?: AnimatedFileUploadVariant;
  /** 紧凑横向条模式，适合嵌入表单行或窄侧栏 */
  compact?: boolean;
  /** 是否在拖拽区展示体积与数量约束徽章，默认 true */
  showMetaBadges?: boolean;
  /** 外部表单校验错误文案 */
  error?: string;
  /** 拖拽区主提示文案 */
  label?: string;
  /** 拖拽区副说明文案 */
  description?: string;
  /** 可选异步上传适配器；未传入时文件选择后直接进入就绪状态 */
  uploadAdapter?: UploadAdapter;
  /** 文件列表发生变化时的回调 */
  onFilesChange?: (files: UploadFileItem[]) => void;
  className?: string;
}
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const matchesRule = (file: File, rule: string): boolean => {
  const token = rule.trim().toLowerCase();
  if (!token || token === "*/*") return true;
  if (token.startsWith(".")) return file.name.toLowerCase().endsWith(token);
  if (token.endsWith("/*")) return file.type.toLowerCase().startsWith(token.slice(0, -1));
  return file.type.toLowerCase() === token;
};

const matchesAccept = (file: File, accept?: string): boolean => {
  if (!accept) return true;
  return accept.split(",").some((rule) => matchesRule(file, rule));
};

const createPreviewUrl = (file: File): string | undefined => {
  if (!file.type.startsWith("image/") || typeof URL.createObjectURL !== "function")
    return undefined;
  return URL.createObjectURL(file);
};

const revokePreviewUrl = (url?: string) => {
  if (url && typeof URL.revokeObjectURL === "function") URL.revokeObjectURL(url);
};

const validateFiles = (
  incoming: File[],
  existingCount: number,
  options: { accept?: string; maxSize?: number; maxFiles?: number },
): { accepted: File[]; errors: string[] } => {
  const accepted: File[] = [];
  const errors: string[] = [];

  for (const file of incoming) {
    if (!matchesAccept(file, options.accept)) {
      errors.push(`${file.name} 类型不受支持`);
    } else if (options.maxSize !== undefined && file.size > options.maxSize) {
      errors.push(`${file.name} 超过 ${formatFileSize(options.maxSize)} 限制`);
    } else if (
      options.maxFiles !== undefined &&
      existingCount + accepted.length >= options.maxFiles
    ) {
      errors.push(`最多只能上传 ${options.maxFiles} 个文件`);
    } else {
      accepted.push(file);
    }
  }

  return { accepted, errors };
};
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

const UploadRow = ({
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
interface UseFileUploadOptions {
  accept?: string;
  multiple: boolean;
  maxSize?: number;
  maxFiles?: number;
  uploadAdapter?: UploadAdapter;
  onFilesChange?: (files: UploadFileItem[]) => void;
}

const buildItem = (file: File, id: string, hasAdapter: boolean): UploadFileItem => ({
  id,
  file,
  name: file.name,
  size: file.size,
  type: file.type,
  previewUrl: createPreviewUrl(file),
  status: hasAdapter ? "uploading" : "ready",
  progress: hasAdapter ? 0 : 100,
});

const patchRow = (
  items: UploadFileItem[],
  id: string,
  patch: Partial<UploadFileItem>,
): UploadFileItem[] => items.map((row) => (row.id === id ? { ...row, ...patch } : row));

const cleanupItems = (items: UploadFileItem[], controllers: Map<string, AbortController>) => {
  for (const ctrl of controllers.values()) ctrl.abort();
  controllers.clear();
  for (const item of items) revokePreviewUrl(item.previewUrl);
};

const runUploadTask = (
  item: UploadFileItem,
  adapter: UploadAdapter,
  controllers: Map<string, AbortController>,
  commit: (updater: (prev: UploadFileItem[]) => UploadFileItem[]) => void,
) => {
  const controller = new AbortController();
  controllers.set(item.id, controller);

  adapter(item.file, {
    signal: controller.signal,
    onProgress: (percent) =>
      commit((prev) => patchRow(prev, item.id, { status: "uploading", progress: percent })),
  })
    .then(() => {
      controllers.delete(item.id);
      commit((prev) =>
        patchRow(prev, item.id, { status: "success", progress: 100, error: undefined }),
      );
    })
    .catch((err: unknown) => {
      controllers.delete(item.id);
      if (controller.signal.aborted) return;
      const message = err instanceof Error ? err.message : "上传失败";
      commit((prev) => patchRow(prev, item.id, { status: "error", error: message }));
    });
};

const createBatch = (accepted: File[], seqRef: { current: number }, hasAdapter: boolean) =>
  accepted.map((file) => {
    seqRef.current += 1;
    return buildItem(file, `upload-${seqRef.current}`, hasAdapter);
  });

const abortItem = (id: string, controllers: Map<string, AbortController>) => {
  controllers.get(id)?.abort();
  controllers.delete(id);
};

interface EnqueueContext {
  options: UseFileUploadOptions;
  state: { files: UploadFileItem[]; adapter?: UploadAdapter };
  seqRef: { current: number };
  controllers: Map<string, AbortController>;
  setErrorMessage: (msg: string | null) => void;
  commit: (updater: (prev: UploadFileItem[]) => UploadFileItem[]) => void;
}

const enqueueFiles = (incoming: File[], ctx: EnqueueContext) => {
  const { options, state, seqRef, controllers, setErrorMessage, commit } = ctx;
  const list = options.multiple ? incoming : incoming.slice(0, 1);
  const { accepted, errors } = validateFiles(
    list,
    options.multiple ? state.files.length : 0,
    options,
  );
  setErrorMessage(errors.length > 0 ? errors.join("；") : null);
  if (accepted.length === 0) return;

  const created = createBatch(accepted, seqRef, Boolean(state.adapter));
  if (!options.multiple) cleanupItems(state.files, controllers);
  commit((prev) => (options.multiple ? [...prev, ...created] : created));
  if (state.adapter) {
    for (const item of created) runUploadTask(item, state.adapter, controllers, commit);
  }
};

const removeRow = (
  id: string,
  controllers: Map<string, AbortController>,
  commit: (updater: (prev: UploadFileItem[]) => UploadFileItem[]) => void,
) => {
  abortItem(id, controllers);
  commit((prev) => {
    revokePreviewUrl(prev.find((row) => row.id === id)?.previewUrl);
    return prev.filter((row) => row.id !== id);
  });
};

const retryRow = (
  id: string,
  state: { files: UploadFileItem[]; adapter?: UploadAdapter },
  controllers: Map<string, AbortController>,
  commit: (updater: (prev: UploadFileItem[]) => UploadFileItem[]) => void,
) => {
  const target = state.files.find((row) => row.id === id);
  if (!target || !state.adapter) return;
  commit((prev) => patchRow(prev, id, { status: "uploading", progress: 0, error: undefined }));
  runUploadTask(target, state.adapter, controllers, commit);
};

const useFileUpload = (options: UseFileUploadOptions) => {
  const [files, setFiles] = useState<UploadFileItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const seqRef = useRef(0);
  const controllersRef = useRef(new Map<string, AbortController>());
  const stateRef = useRef({
    files,
    onChange: options.onFilesChange,
    adapter: options.uploadAdapter,
  });

  useEffect(() => {
    stateRef.current = { files, onChange: options.onFilesChange, adapter: options.uploadAdapter };
  });
  useEffect(() => () => cleanupItems(stateRef.current.files, controllersRef.current), []);

  const commit = (updater: (prev: UploadFileItem[]) => UploadFileItem[]) => {
    setFiles((prev) => {
      const next = updater(prev);
      stateRef.current.onChange?.(next);
      return next;
    });
  };

  const addFiles = (incoming: File[]) =>
    enqueueFiles(incoming, {
      options,
      state: stateRef.current,
      seqRef,
      controllers: controllersRef.current,
      setErrorMessage,
      commit,
    });

  const clearAll = () => {
    cleanupItems(stateRef.current.files, controllersRef.current);
    setErrorMessage(null);
    commit(() => []);
  };

  return {
    files,
    errorMessage,
    addFiles,
    removeFile: (id: string) => removeRow(id, controllersRef.current, commit),
    retryFile: (id: string) => retryRow(id, stateRef.current, controllersRef.current, commit),
    clearAll,
  };
};
const DropzoneBadge = ({
  dragging,
  compact,
  reduceMotion,
}: {
  dragging: boolean;
  compact: boolean;
  reduceMotion: boolean;
}) => (
  <motion.span
    aria-hidden="true"
    animate={dragging && !reduceMotion ? { y: -3, scale: 1.06 } : { y: 0, scale: 1 }}
    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 24 }}
    className={cn(
      DROPZONE_ICON_CLASSES,
      compact ? "size-8 rounded-lg" : "size-10 rounded-xl",
      dragging && "border-signal/40 bg-signal/10 text-signal",
    )}
  >
    <UploadCloud className={compact ? "size-4" : "size-5"} />
  </motion.span>
);

const MetaBadges = ({ maxSize, maxFiles }: { maxSize?: number; maxFiles?: number }) => {
  if (!maxSize && !maxFiles) return null;
  return (
    <span className="flex flex-wrap items-center justify-center gap-1.5">
      {maxSize !== undefined && (
        <span className="rounded-full border border-solid border-border/75 bg-background/80 px-2 py-0.5 font-mono text-[11px] text-muted-foreground dark:border-white/10">
          单文件 ≤ {formatFileSize(maxSize)}
        </span>
      )}
      {maxFiles !== undefined && (
        <span className="rounded-full border border-solid border-border/75 bg-background/80 px-2 py-0.5 font-mono text-[11px] text-muted-foreground dark:border-white/10">
          最多 {maxFiles} 份
        </span>
      )}
    </span>
  );
};

interface DropzoneButtonProps {
  dragging: boolean;
  disabled: boolean;
  invalid: boolean;
  variant: AnimatedFileUploadVariant;
  compact: boolean;
  showMetaBadges: boolean;
  maxSize?: number;
  maxFiles?: number;
  label: string;
  description: string;
  reduceMotion: boolean;
  onBrowse: () => void;
  onDragState: (active: boolean) => void;
  onDropFiles: (files: File[]) => void;
}

const DropzoneButton = (props: DropzoneButtonProps) => {
  const { dragging, disabled, invalid, variant, compact, reduceMotion } = props;
  return (
    <button
      type="button"
      disabled={disabled}
      data-dragging={dragging ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      onClick={props.onBrowse}
      onDragEnter={(event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!disabled) props.onDragState(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => props.onDragState(false)}
      onDrop={(event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        props.onDragState(false);
        if (disabled) return;
        const dropped = Array.from(event.dataTransfer.files ?? []);
        if (dropped.length > 0) props.onDropFiles(dropped);
      }}
      className={cn(
        DROPZONE_BASE,
        DROPZONE_VARIANT_CLASSES[variant],
        compact ? DROPZONE_LAYOUT_CLASSES.compact : DROPZONE_LAYOUT_CLASSES.regular,
        invalid && DROPZONE_INVALID_CLASSES,
      )}
    >
      <span className={cn("flex items-center gap-3", !compact && "flex-col")}>
        <DropzoneBadge dragging={dragging} compact={compact} reduceMotion={reduceMotion} />
        <span className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium text-foreground">
            {dragging ? "松开以添加文件" : props.label}
          </span>
          <span className="text-xs text-muted-foreground">{props.description}</span>
        </span>
      </span>
      {compact ? (
        <span className="shrink-0 rounded-lg border border-solid border-border/80 bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/12 dark:bg-card">
          选择文件
        </span>
      ) : (
        props.showMetaBadges && <MetaBadges maxSize={props.maxSize} maxFiles={props.maxFiles} />
      )}
    </button>
  );
};

const FileListSection = ({
  files,
  reduceMotion,
  onClear,
  onRemove,
  onRetry,
}: {
  files: UploadFileItem[];
  reduceMotion: boolean;
  onClear: () => void;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}) => {
  const totalBytes = files.reduce((sum, item) => sum + item.size, 0);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground tabular-nums uppercase">
          已选文件 ({files.length}) · {formatFileSize(totalBytes)}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer rounded-md border border-solid border-transparent bg-transparent px-1.5 py-0.5 font-sans text-xs text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset"
        >
          清空
        </button>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        <AnimatePresence initial={false}>
          {files.map((item) => (
            <UploadRow
              key={item.id}
              item={item}
              reduceMotion={reduceMotion}
              onRemove={onRemove}
              onRetry={onRetry}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

const ErrorAlert = ({ message }: { message: string }) => (
  <p
    role="alert"
    className="m-0 rounded-xl border border-solid border-destructive/40 bg-destructive/6 px-3 py-2 text-xs text-destructive dark:border-destructive/75"
  >
    {message}
  </p>
);

interface UploadConfig {
  multiple: boolean;
  disabled: boolean;
  variant: AnimatedFileUploadVariant;
  compact: boolean;
  showMetaBadges: boolean;
  label: string;
  description: string;
}

const resolveUploadConfig = (props: AnimatedFileUploadProps): UploadConfig => ({
  multiple: props.multiple ?? true,
  disabled: props.disabled ?? false,
  variant: props.variant ?? "default",
  compact: props.compact ?? false,
  showMetaBadges: props.showMetaBadges ?? true,
  label: props.label ?? "拖拽文件到此处，或点击浏览",
  description: props.description ?? "支持图片、文档或代码片段",
});

const HiddenFileInput = ({
  inputRef,
  accept,
  multiple,
  disabled,
  onFiles,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept?: string;
  multiple: boolean;
  disabled: boolean;
  onFiles: (files: File[]) => void;
}) => (
  <input
    ref={inputRef}
    type="file"
    aria-label="选择要上传的文件"
    accept={accept}
    multiple={multiple}
    disabled={disabled}
    onChange={(event: ChangeEvent<HTMLInputElement>) => {
      const picked = Array.from(event.target.files ?? []);
      if (picked.length > 0) onFiles(picked);
      event.target.value = "";
    }}
    className="sr-only"
  />
);

export const AnimatedFileUpload = (props: AnimatedFileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const cfg = resolveUploadConfig(props);
  const state = useFileUpload({ ...props, multiple: cfg.multiple });
  const activeError = state.errorMessage ?? props.error ?? null;

  return (
    <div
      data-slot="animated-file-upload"
      data-variant={cfg.variant}
      data-compact={cfg.compact ? "" : undefined}
      className={cn("flex w-full max-w-md flex-col gap-3 font-sans", props.className)}
    >
      <HiddenFileInput
        inputRef={inputRef}
        accept={props.accept}
        multiple={cfg.multiple}
        disabled={cfg.disabled}
        onFiles={state.addFiles}
      />
      <DropzoneButton
        {...cfg}
        dragging={dragging}
        invalid={Boolean(activeError)}
        maxSize={props.maxSize}
        maxFiles={props.maxFiles}
        reduceMotion={reduceMotion}
        onBrowse={() => inputRef.current?.click()}
        onDragState={setDragging}
        onDropFiles={state.addFiles}
      />
      {activeError && <ErrorAlert message={activeError} />}
      {state.files.length > 0 && (
        <FileListSection
          files={state.files}
          reduceMotion={reduceMotion}
          onClear={state.clearAll}
          onRemove={state.removeFile}
          onRetry={state.retryFile}
        />
      )}
    </div>
  );
};
