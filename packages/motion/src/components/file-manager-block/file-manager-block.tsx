"use client";

/**
 * FileManagerBlock：由 AnimatedFileUpload 与 SelectionBasket 组合的文件资产管理区块。
 */
import { cn } from "@matt-ui/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { AnimatedFileUpload } from "../animated-file-upload/index.js";
import { SelectionBasket } from "../selection-basket/index.js";
import { buildFolderSummaries, FileRows, FolderCards, UploadHeader } from "./file-manager-parts.js";
import type { FileManagerBlockProps, ManagedFileEntry } from "./file-manager-block.types.js";
import {
  DEFAULT_MANAGED_FILES,
  FILE_MANAGER_CONTAINER_STYLES,
} from "./file-manager-block.variants.js";

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
