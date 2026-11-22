// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AnimatedFileUpload：支持拖拽高光、文件校验、缩略图预览与适配器上传进度的动效上传组件。
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

export type UploadFileStatus = "ready" | "uploading" | "success" | "error";

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
  "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

const FilePreview = ({ item }: { item: UploadFileItem }) => {
  if (item.previewUrl) {
    return (
      <img
        src={item.previewUrl}
        alt=""
        className="size-9 shrink-0 rounded-lg border border-solid border-border object-cover"
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
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-solid border-border/80 bg-secondary/70 text-muted-foreground"
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
    <p className="m-0 truncate text-sm font-medium text-foreground">{item.name}</p>
    <p
      className={cn(
        "m-0 mt-0.5 flex items-center gap-1 text-xs",
        item.status === "error" ? "text-destructive" : "text-muted-foreground",
      )}
    >
      {item.status === "success" && (
        <CheckCircle2 aria-hidden="true" className="size-3.5 text-success" />
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
      "relative flex items-center gap-3 overflow-hidden rounded-xl border border-solid border-border bg-card px-3 py-2.5 shadow-sm",
      item.status === "error" && "border-destructive/30 bg-destructive/6",
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
const DROPZONE_CLASSES = cn(
  "group relative flex min-h-[176px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/35 p-6 text-center dark:bg-card/60",
  "transition-[border-color,background-color,transform] duration-(--ui-duration-fast) outline-none active:scale-[0.99]",
  "hover:border-foreground/28 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
  "data-dragging:border-signal data-dragging:bg-signal/6",
  "disabled:pointer-events-none disabled:opacity-50",
);

const DropzoneBadge = ({
  dragging,
  reduceMotion,
}: {
  dragging: boolean;
  reduceMotion: boolean;
}) => (
  <motion.span
    aria-hidden="true"
    animate={dragging && !reduceMotion ? { y: -3, scale: 1.06 } : { y: 0, scale: 1 }}
    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 24 }}
    className={cn(
      "inline-flex size-10 items-center justify-center rounded-xl border border-solid border-border bg-background text-muted-foreground shadow-sm transition-colors duration-(--ui-duration-fast) group-hover:text-foreground dark:bg-card",
      dragging && "border-signal/35 bg-signal/10 text-signal",
    )}
  >
    <UploadCloud className="size-5" />
  </motion.span>
);

const DropzoneButton = ({
  dragging,
  disabled,
  label,
  description,
  reduceMotion,
  onBrowse,
  onDragState,
  onDropFiles,
}: {
  dragging: boolean;
  disabled: boolean;
  label: string;
  description: string;
  reduceMotion: boolean;
  onBrowse: () => void;
  onDragState: (active: boolean) => void;
  onDropFiles: (files: File[]) => void;
}) => (
  <button
    type="button"
    disabled={disabled}
    data-dragging={dragging ? "" : undefined}
    onClick={onBrowse}
    onDragEnter={(event: DragEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!disabled) onDragState(true);
    }}
    onDragOver={(event) => event.preventDefault()}
    onDragLeave={() => onDragState(false)}
    onDrop={(event: DragEvent<HTMLButtonElement>) => {
      event.preventDefault();
      onDragState(false);
      if (disabled) return;
      const dropped = Array.from(event.dataTransfer.files ?? []);
      if (dropped.length > 0) onDropFiles(dropped);
    }}
    className={DROPZONE_CLASSES}
  >
    <DropzoneBadge dragging={dragging} reduceMotion={reduceMotion} />
    <span className="flex flex-col gap-1">
      <span className="text-sm font-medium text-foreground">
        {dragging ? "松开以添加文件" : label}
      </span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </span>
  </button>
);

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
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between px-1">
      <span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
        已选文件 ({files.length})
      </span>
      <button
        type="button"
        onClick={onClear}
        className="cursor-pointer rounded-md border-0 bg-transparent px-1.5 py-0.5 font-sans text-xs text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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

const ErrorAlert = ({ message }: { message: string }) => (
  <p
    role="alert"
    className="m-0 rounded-xl border border-solid border-destructive/25 bg-destructive/6 px-3 py-2 text-xs text-destructive"
  >
    {message}
  </p>
);

export const AnimatedFileUpload = (props: AnimatedFileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const multiple = props.multiple ?? true;
  const disabled = props.disabled ?? false;
  const state = useFileUpload({ ...props, multiple });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    if (picked.length > 0) state.addFiles(picked);
    event.target.value = "";
  };

  return (
    <div
      data-slot="animated-file-upload"
      className={cn("flex w-full max-w-md flex-col gap-3 font-sans", props.className)}
    >
      <input
        ref={inputRef}
        type="file"
        aria-label="选择要上传的文件"
        accept={props.accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
      />
      <DropzoneButton
        dragging={dragging}
        disabled={disabled}
        label={props.label ?? "拖拽文件到此处，或点击浏览"}
        description={props.description ?? "支持图片、文档或代码片段"}
        reduceMotion={reduceMotion}
        onBrowse={() => inputRef.current?.click()}
        onDragState={setDragging}
        onDropFiles={state.addFiles}
      />
      {state.errorMessage && <ErrorAlert message={state.errorMessage} />}
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
