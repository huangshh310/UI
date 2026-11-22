"use client";

/**
 * AnimatedFileUpload 状态管理与适配器上传生命周期。
 * 组件卸载或移除文件时自动中止进行中的上传并回收对象 URL。
 */
import { useEffect, useRef, useState } from "react";
import type { UploadAdapter, UploadFileItem } from "./animated-file-upload.types.js";
import { createPreviewUrl, revokePreviewUrl, validateFiles } from "./upload-helpers.js";

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

export const useFileUpload = (options: UseFileUploadOptions) => {
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
