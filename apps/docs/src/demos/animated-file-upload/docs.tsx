"use client";

import { AnimatedFileUpload } from "@matt-ui/motion";

export default function AnimatedFileUploadDocsDemo() {
  return (
    <div className="w-full max-w-md">
      <AnimatedFileUpload
        label="上传设计规范或 JSON Token（最多 2 份）"
        accept=".json,.md,.pdf"
        maxFiles={2}
        maxSize={2 * 1024 * 1024}
      />
    </div>
  );
}
