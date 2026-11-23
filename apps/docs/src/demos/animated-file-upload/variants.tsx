"use client";

/**
 * 示例：AnimatedFileUpload 的紧凑条模式、填充风格与外部错误反馈。
 */
import { AnimatedFileUpload } from "@matt-ui/motion";

export default function AnimatedFileUploadVariantsDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">紧凑横向条（Compact）</span>
        <AnimatedFileUpload
          compact
          variant="minimal"
          label="附加设计稿或说明书"
          description="PDF / PNG · 最大 5 MB"
          accept=".pdf,image/png"
          maxSize={5 * 1024 * 1024}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          柔灰填充与校验态（Filled）
        </span>
        <AnimatedFileUpload
          variant="filled"
          label="上传发票凭证"
          description="支持 PDF 或 JPG 格式"
          accept=".pdf,.jpg,.jpeg"
          maxFiles={1}
          multiple={false}
          error="请至少上传 1 份有效发票凭证"
        />
      </div>
    </div>
  );
}
