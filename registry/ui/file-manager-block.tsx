// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { AnimatedFileUpload } from "@/components/ui/animated-file-upload";
import { SelectionBasket } from "@/components/ui/selection-basket";
import { cn } from "@/lib/utils";
import { FileCode2, Folder, Trash2, UploadCloud } from "lucide-react";
import { useState } from "react";

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
  /** 自定义类名 */
  className?: string;
}
const DEFAULT_FILES: ManagedFileEntry[] = [
  {
    id: "1",
    name: "design-tokens.css",
    folder: "Token",
    sizeLabel: "18 KB",
    updatedAt: "2 分钟前",
  },
  {
    id: "2",
    name: "registry.json",
    folder: "分发清单",
    sizeLabel: "42 KB",
    updatedAt: "15 分钟前",
  },
  {
    id: "3",
    name: "component-roadmap.md",
    folder: "文档",
    sizeLabel: "11 KB",
    updatedAt: "1 小时前",
  },
];

const FOLDERS = [
  {
    name: "Token 主题",
    count: "6 项",
  },
  {
    name: "Registry 清单",
    count: "89 项",
  },
  {
    name: "架构文档",
    count: "12 项",
  },
];

const FolderCards = () => (
  <div className="grid grid-cols-1 gap-3 @xl:grid-cols-3">
    {FOLDERS.map((folder) => (
      <div
        key={folder.name}
        className="flex items-center gap-3 rounded-2xl border border-solid border-border/80 bg-secondary/40 p-3.5 transition-colors hover:bg-secondary/65"
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-solid border-border bg-background text-foreground shadow-xs dark:bg-card">
          <Folder aria-hidden="true" className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="m-0 truncate text-xs font-semibold text-foreground">{folder.name}</p>
          <p className="m-0 mt-0.5 font-mono text-[11px] text-muted-foreground">{folder.count}</p>
        </div>
      </div>
    ))}
  </div>
);

const FileRows = ({
  files,
  selectedIds,
  onToggle,
}: {
  files: ManagedFileEntry[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) => (
  <div className="overflow-hidden rounded-xl border border-solid border-border">
    {files.map((file) => {
      const checked = selectedIds.includes(file.id);
      return (
        <label
          key={file.id}
          className={cn(
            "flex cursor-pointer items-center gap-3 border-b border-solid border-border/70 px-3.5 py-2.5 text-xs transition-colors last:border-b-0",
            checked ? "bg-signal/8" : "hover:bg-accent/45",
          )}
        >
          <input
            type="checkbox"
            aria-label={`选择 ${file.name}`}
            checked={checked}
            onChange={() => onToggle(file.id)}
            className="size-4 accent-signal"
          />
          <FileCode2 aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate font-medium text-foreground">{file.name}</span>
          <span className="hidden text-muted-foreground sm:inline">{file.folder}</span>
          <span className="font-mono text-muted-foreground tabular-nums">{file.sizeLabel}</span>
          <span className="text-muted-foreground">{file.updatedAt}</span>
        </label>
      );
    })}
  </div>
);

const UploadHeader = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => (
  <div className="flex flex-wrap items-center justify-between gap-2">
    <div>
      <p className="m-0 text-sm font-semibold text-foreground">组件资产库</p>
      <p className="m-0 text-xs text-muted-foreground">管理样式源码、清单与静态资源。</p>
    </div>
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-primary bg-primary px-3.5 font-sans text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <UploadCloud aria-hidden="true" className="size-3.5" />
      <span>{open ? "收起上传" : "上传文件"}</span>
    </button>
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

export const FileManagerBlock = (props: FileManagerBlockProps) => {
  const [files, setFiles] = useState(props.initialFiles ?? DEFAULT_FILES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const actions = [
    {
      id: "delete",
      label: "删除",
      tone: "destructive" as const,
      icon: <Trash2 className="size-3.5" />,
      onClick: () => {
        setFiles((prev) => prev.filter((f) => !selectedIds.includes(f.id)));
        setSelectedIds([]);
      },
    },
  ];

  return (
    <div
      data-slot="file-manager-block"
      className={cn(
        "@container flex w-full max-w-4xl flex-col gap-4 rounded-[24px] border border-solid border-border bg-card p-6 shadow-xs",
        props.className,
      )}
    >
      <UploadHeader open={showUpload} onToggle={() => setShowUpload((open) => !open)} />
      {showUpload && (
        <AnimatedFileUpload
          label="拖拽资源文件到这里上传"
          maxFiles={4}
          onFilesChange={(uploaded) => setFiles((prev) => mergeUploaded(prev, uploaded))}
        />
      )}
      <FolderCards />
      <FileRows files={files} selectedIds={selectedIds} onToggle={toggle} />
      <div className="flex justify-center">
        <SelectionBasket
          count={selectedIds.length}
          totalCount={files.length}
          floating={false}
          onSelectAll={() => setSelectedIds(files.map((f) => f.id))}
          onClear={() => setSelectedIds([])}
          actions={actions}
        />
      </div>
    </div>
  );
};
