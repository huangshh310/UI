// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * FileManagerBlock：由 AnimatedFileUpload 与 SelectionBasket 组合的文件资产管理区块。
 */

import { AnimatedFileUpload } from "@/components/ui/animated-file-upload";
import { SelectionBasket, type SelectionBasketVariant } from "@/components/ui/selection-basket";
import { cn } from "@/lib/utils";
import { FileArchive, FileCode2, FileText, Folder, Trash2, UploadCloud } from "lucide-react";
import { useState } from "react";

export const DEFAULT_MANAGED_FILES: ManagedFileEntry[] = [
  {
    id: "1",
    name: "design-tokens.css",
    folder: "Token 主题",
    sizeLabel: "18 KB",
    updatedAt: "2 分钟前",
  },
  {
    id: "2",
    name: "registry.json",
    folder: "Registry 清单",
    sizeLabel: "42 KB",
    updatedAt: "15 分钟前",
  },
  {
    id: "3",
    name: "component-roadmap.md",
    folder: "架构文档",
    sizeLabel: "11 KB",
    updatedAt: "1 小时前",
  },
];

export const FILE_MANAGER_CONTAINER_STYLES: Record<FileManagerBlockVariant, string> = {
  default: "border-border/80 bg-card shadow-xs dark:border-white/10",
  elevated:
    "border-border/80 bg-card shadow-lg dark:border-white/12 dark:shadow-[0_18px_40px_rgba(0,0,0,0.42)]",
  minimal: "border-border/75 bg-secondary/25 shadow-none dark:border-white/10 dark:bg-card/80",
};

export const FOLDER_CARD_BASE =
  "flex cursor-pointer items-center gap-3 rounded-2xl border border-solid text-left transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast) outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid";

export const FOLDER_CARD_STATE = {
  active: "border-foreground/30 bg-card shadow-xs dark:border-white/25 dark:bg-white/[0.06]",
  idle: "border-border/80 bg-secondary/40 hover:border-foreground/20 hover:bg-secondary/65 dark:border-white/10 dark:bg-white/[0.025] dark:hover:border-white/20",
} as const;
export type FileManagerBlockVariant = "default" | "elevated" | "minimal";

export interface ManagedFileEntry {
  id: string;
  name: string;
  folder: string;
  sizeLabel: string;
  updatedAt: string;
}

export interface FileManagerBlockProps {
  /** 初始文件列表 */
  initialFiles?: ManagedFileEntry[];
  /** 区块主标题，默认「组件资产库」 */
  title?: string;
  /** 区块副标题说明 */
  description?: string;
  /** 外框视觉风格：标准发丝描边、浮层阴影或极简低噪 */
  variant?: FileManagerBlockVariant;
  /** 底部 SelectionBasket 浮舱样式 */
  basketVariant?: SelectionBasketVariant;
  /** 紧凑密度模式 */
  compact?: boolean;
  /** 批量删除完成后的回调 */
  onDeleteFiles?: (deletedIds: string[]) => void;
  /** 自定义类名 */
  className?: string;
}
interface FolderSummary {
  name: string;
  count: number;
}

const buildFolderSummaries = (files: ManagedFileEntry[]): FolderSummary[] => {
  const counts = new Map<string, number>();
  for (const file of files) {
    counts.set(file.folder, (counts.get(file.folder) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
};

const renderFileIcon = (fileName: string) => {
  if (fileName.endsWith(".md") || fileName.endsWith(".txt")) {
    return <FileText aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />;
  }
  if (fileName.endsWith(".tgz") || fileName.endsWith(".zip")) {
    return <FileArchive aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />;
  }
  return <FileCode2 aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />;
};

const UploadHeader = ({
  title,
  description,
  fileCount,
  open,
  onToggle,
}: {
  title: string;
  description: string;
  fileCount: number;
  open: boolean;
  onToggle: () => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <p className="m-0 text-sm font-semibold tracking-[-0.015em] text-foreground">{title}</p>
        <span className="rounded-full border border-solid border-border/80 bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground tabular-nums dark:border-white/10">
          {fileCount} 项
        </span>
      </div>
      <p className="m-0 mt-0.5 text-xs text-muted-foreground">{description}</p>
    </div>
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-primary bg-primary px-3.5 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-[opacity,transform] active:scale-[0.98] hover:opacity-92 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
    >
      <UploadCloud aria-hidden="true" className="size-3.5" />
      <span>{open ? "收起上传" : "上传文件"}</span>
    </button>
  </div>
);

const FolderCards = ({
  folders,
  activeFolder,
  compact,
  onSelectFolder,
}: {
  folders: FolderSummary[];
  activeFolder: string | null;
  compact: boolean;
  onSelectFolder: (name: string | null) => void;
}) => {
  if (folders.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-2.5 @xl:grid-cols-3">
      {folders.map((folder) => {
        const active = activeFolder === folder.name;
        return (
          <button
            key={folder.name}
            type="button"
            aria-pressed={active}
            onClick={() => onSelectFolder(active ? null : folder.name)}
            className={cn(
              FOLDER_CARD_BASE,
              compact ? "p-3" : "p-3.5",
              active ? FOLDER_CARD_STATE.active : FOLDER_CARD_STATE.idle,
            )}
          >
            <span
              className={cn(
                "inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-solid shadow-xs",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/80 bg-background text-foreground dark:border-white/10 dark:bg-card",
              )}
            >
              <Folder aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-xs font-semibold text-foreground">{folder.name}</p>
              <p className="m-0 mt-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">
                {folder.count} 个文件
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const FileRowItem = ({
  file,
  checked,
  compact,
  onToggle,
}: {
  file: ManagedFileEntry;
  checked: boolean;
  compact: boolean;
  onToggle: (id: string) => void;
}) => (
  <label
    className={cn(
      "flex cursor-pointer items-center gap-3 border-b border-solid border-border/70 px-3.5 text-xs transition-colors last:border-b-0 dark:border-white/10",
      compact ? "py-2" : "py-2.5",
      checked ? "bg-signal/8 dark:bg-signal/14" : "hover:bg-accent/45",
    )}
  >
    <input
      type="checkbox"
      aria-label={`选择 ${file.name}`}
      checked={checked}
      onChange={() => onToggle(file.id)}
      className="size-4 cursor-pointer accent-signal outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-solid border-border/80 bg-secondary/50 dark:border-white/10 dark:bg-white/[0.04]">
      {renderFileIcon(file.name)}
    </span>
    <span className="min-w-0 flex-1 truncate font-medium text-foreground">{file.name}</span>
    <span className="hidden rounded-full border border-solid border-border/75 bg-secondary/50 px-2 py-0.5 text-[11px] text-muted-foreground sm:inline dark:border-white/10">
      {file.folder}
    </span>
    <span className="w-14 text-right font-mono text-muted-foreground tabular-nums">
      {file.sizeLabel}
    </span>
    <span className="w-16 text-right text-muted-foreground">{file.updatedAt}</span>
  </label>
);

const FileRows = ({
  files,
  selectedIds,
  activeFolder,
  compact,
  onToggle,
  onClearFolder,
}: {
  files: ManagedFileEntry[];
  selectedIds: string[];
  activeFolder: string | null;
  compact: boolean;
  onToggle: (id: string) => void;
  onClearFolder: () => void;
}) => (
  <div className="overflow-hidden rounded-2xl border border-solid border-border/80 bg-card dark:border-white/10">
    <div className="flex items-center gap-3 border-b border-solid border-border/80 bg-secondary/40 px-3.5 py-2 text-[11px] font-medium text-muted-foreground dark:border-white/10 dark:bg-white/[0.03]">
      <span className="size-4 shrink-0" aria-hidden="true" />
      <span className="flex-1">文件名称</span>
      <span className="hidden sm:inline">所属目录</span>
      <span className="w-14 text-right">体积</span>
      <span className="w-16 text-right">更新时间</span>
    </div>
    {files.length === 0 ? (
      <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
        <p className="m-0 text-xs text-muted-foreground">当前视图下暂无文件资产</p>
        {activeFolder && (
          <button
            type="button"
            onClick={onClearFolder}
            className="cursor-pointer rounded-full border border-solid border-border/80 bg-secondary/70 px-3 py-1 font-sans text-xs font-medium text-foreground transition-colors hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-white/10"
          >
            显示全部文件
          </button>
        )}
      </div>
    ) : (
      files.map((file) => (
        <FileRowItem
          key={file.id}
          file={file}
          checked={selectedIds.includes(file.id)}
          compact={compact}
          onToggle={onToggle}
        />
      ))
    )}
  </div>
);
const mapUploaded = (uploaded: { id: string; name: string; size: number }[]): ManagedFileEntry[] =>
  uploaded.map((item) => ({
    id: item.id,
    name: item.name,
    folder: "新上传",
    sizeLabel: `${Math.max(1, Math.round(item.size / 1024))} KB`,
    updatedAt: "刚刚",
  }));

const mergeUploaded = (
  prev: ManagedFileEntry[],
  uploaded: { id: string; name: string; size: number }[],
): ManagedFileEntry[] => {
  const added = mapUploaded(uploaded);
  return [...added.filter((a) => !prev.some((p) => p.id === a.id)), ...prev];
};

const createDeleteAction = (onDelete: () => void) => [
  {
    id: "delete",
    label: "删除",
    tone: "destructive" as const,
    icon: <Trash2 className="size-3.5" />,
    onClick: onDelete,
  },
];

const useFileManagerState = (props: FileManagerBlockProps) => {
  const [files, setFiles] = useState(props.initialFiles ?? DEFAULT_MANAGED_FILES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const visibleFiles = activeFolder ? files.filter((f) => f.folder === activeFolder) : files;
  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const handleDelete = () => {
    const removed = [...selectedIds];
    setFiles((prev) => prev.filter((f) => !removed.includes(f.id)));
    setSelectedIds([]);
    props.onDeleteFiles?.(removed);
  };

  return {
    files,
    visibleFiles,
    selectedIds,
    activeFolder,
    showUpload,
    setFiles,
    setSelectedIds,
    setActiveFolder,
    setShowUpload,
    toggle,
    handleDelete,
  };
};

const FileManagerBasket = ({
  state,
  basketVariant,
}: {
  state: ReturnType<typeof useFileManagerState>;
  basketVariant: FileManagerBlockProps["basketVariant"];
}) => (
  <div className="flex justify-center">
    <SelectionBasket
      count={state.selectedIds.length}
      totalCount={state.visibleFiles.length}
      variant={basketVariant ?? "default"}
      floating={false}
      onSelectAll={() => state.setSelectedIds(state.visibleFiles.map((f) => f.id))}
      onClear={() => state.setSelectedIds([])}
      actions={createDeleteAction(state.handleDelete)}
    />
  </div>
);

export const FileManagerBlock = (props: FileManagerBlockProps) => {
  const variant = props.variant ?? "default";
  const compact = props.compact ?? false;
  const state = useFileManagerState(props);

  return (
    <div
      data-slot="file-manager-block"
      data-variant={variant}
      className={cn(
        "@container flex w-full max-w-4xl flex-col rounded-[24px] border border-solid",
        compact ? "gap-3.5 p-4 sm:p-5" : "gap-4 p-5 sm:p-6",
        FILE_MANAGER_CONTAINER_STYLES[variant],
        props.className,
      )}
    >
      <UploadHeader
        title={props.title ?? "组件资产库"}
        description={props.description ?? "管理样式源码、清单与静态资源。"}
        fileCount={state.files.length}
        open={state.showUpload}
        onToggle={() => state.setShowUpload((open) => !open)}
      />
      {state.showUpload && (
        <AnimatedFileUpload
          label="拖拽资源文件到这里上传"
          compact={compact}
          maxFiles={4}
          onFilesChange={(uploaded) => state.setFiles((prev) => mergeUploaded(prev, uploaded))}
        />
      )}
      <FolderCards
        folders={buildFolderSummaries(state.files)}
        activeFolder={state.activeFolder}
        compact={compact}
        onSelectFolder={state.setActiveFolder}
      />
      <FileRows
        files={state.visibleFiles}
        selectedIds={state.selectedIds}
        activeFolder={state.activeFolder}
        compact={compact}
        onToggle={state.toggle}
        onClearFolder={() => state.setActiveFolder(null)}
      />
      <FileManagerBasket state={state} basketVariant={props.basketVariant} />
    </div>
  );
};
