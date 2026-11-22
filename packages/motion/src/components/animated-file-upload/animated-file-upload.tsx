"use client";

/**
 * AnimatedFileUpload：支持拖拽高光、文件校验、缩略图预览与适配器上传进度的动效上传组件。
 * 交互基于原生 <input type="file"> 与 HTML Drag & Drop；拖拽图标上浮与文件列表进出场由 motion 驱动。
 */
import { cn } from "@matt-ui/utils";
import { UploadCloud } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import type { AnimatedFileUploadProps, UploadFileItem } from "./animated-file-upload.types.js";
import { UploadRow } from "./upload-row.js";
import { useFileUpload } from "./use-file-upload.js";

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
