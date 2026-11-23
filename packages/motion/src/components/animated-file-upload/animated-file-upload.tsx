"use client";

/**
 * AnimatedFileUpload：支持拖拽高光、紧凑模式、文件校验、缩略图预览与适配器上传进度的动效上传组件。
 * 交互基于原生 <input type="file"> 与 HTML Drag & Drop；拖拽图标上浮与文件列表进出场由 motion 驱动。
 */
import { cn } from "@matt-ui/utils";
import { UploadCloud } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import type {
  AnimatedFileUploadProps,
  AnimatedFileUploadVariant,
  UploadFileItem,
} from "./animated-file-upload.types.js";
import {
  DROPZONE_BASE,
  DROPZONE_ICON_CLASSES,
  DROPZONE_INVALID_CLASSES,
  DROPZONE_LAYOUT_CLASSES,
  DROPZONE_VARIANT_CLASSES,
} from "./animated-file-upload.variants.js";
import { formatFileSize } from "./upload-helpers.js";
import { UploadRow } from "./upload-row.js";
import { useFileUpload } from "./use-file-upload.js";

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
