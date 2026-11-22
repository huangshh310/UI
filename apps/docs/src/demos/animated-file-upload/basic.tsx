"use client";

/**
 * 示例：AnimatedFileUpload 的拖拽上传、校验与模拟异步上传进度。
 */
import { AnimatedFileUpload, type UploadAdapter } from "@matt-ui/motion";

const mockUpload: UploadAdapter = (_file, { onProgress, signal }) =>
  new Promise((resolve, reject) => {
    let pct = 0;
    const timer = setInterval(() => {
      if (signal.aborted) {
        clearInterval(timer);
        reject(new Error("已取消"));
        return;
      }
      pct = Math.min(100, pct + 25);
      onProgress(pct);
      if (pct >= 100) {
        clearInterval(timer);
        resolve();
      }
    }, 120);
  });

export const AnimatedFileUploadBasic = () => (
  <AnimatedFileUpload
    accept="image/*,.pdf,.md,.txt"
    maxSize={10 * 1024 * 1024}
    maxFiles={4}
    description="支持图片、PDF 或 Markdown，单文件上限 10 MB"
    uploadAdapter={mockUpload}
  />
);
