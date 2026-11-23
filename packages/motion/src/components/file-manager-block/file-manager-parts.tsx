"use client";

/**
 * FileManagerBlock 的子区块：顶部操作栏、目录筛选卡与文件列表。
 */
import { cn } from "@matt-ui/utils";
import { FileArchive, FileCode2, FileText, Folder, UploadCloud } from "lucide-react";
import type { ManagedFileEntry } from "./file-manager-block.types.js";
import { FOLDER_CARD_BASE, FOLDER_CARD_STATE } from "./file-manager-block.variants.js";

export interface FolderSummary {
  name: string;
  count: number;
}

export const buildFolderSummaries = (files: ManagedFileEntry[]): FolderSummary[] => {
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

export const UploadHeader = ({
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

export const FolderCards = ({
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

export const FileRows = ({
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
