/**
 * AnimatedFileUpload 组件的类型定义。
 */

export type UploadFileStatus = "ready" | "uploading" | "success" | "error";
export type AnimatedFileUploadVariant = "default" | "filled" | "minimal";

export interface UploadFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  status: UploadFileStatus;
  progress: number;
  error?: string;
}

export interface UploadAdapterHelpers {
  onProgress: (percent: number) => void;
  signal: AbortSignal;
}

/** 外部注入的上传适配器，使组件不绑定任何具体云存储或后端协议 */
export type UploadAdapter = (file: File, helpers: UploadAdapterHelpers) => Promise<void>;

export interface AnimatedFileUploadProps {
  /** 允许的 MIME 类型或扩展名（与原生 accept 语义一致，逗号分隔） */
  accept?: string;
  /** 是否允许多选 */
  multiple?: boolean;
  /** 单文件最大字节数 */
  maxSize?: number;
  /** 最多允许保留的文件数 */
  maxFiles?: number;
  disabled?: boolean;
  /** 拖拽区视觉风格 */
  variant?: AnimatedFileUploadVariant;
  /** 紧凑横向条模式，适合嵌入表单行或窄侧栏 */
  compact?: boolean;
  /** 是否在拖拽区展示体积与数量约束徽章，默认 true */
  showMetaBadges?: boolean;
  /** 外部表单校验错误文案 */
  error?: string;
  /** 拖拽区主提示文案 */
  label?: string;
  /** 拖拽区副说明文案 */
  description?: string;
  /** 可选异步上传适配器；未传入时文件选择后直接进入就绪状态 */
  uploadAdapter?: UploadAdapter;
  /** 文件列表发生变化时的回调 */
  onFilesChange?: (files: UploadFileItem[]) => void;
  className?: string;
}
