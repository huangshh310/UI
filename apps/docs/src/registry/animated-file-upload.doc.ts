/**
 * Animated File Upload 的文档数据。
 */
import { AnimatedFileUploadBasic } from "@/demos/animated-file-upload/basic";
import AnimatedFileUploadDocsDemo from "@/demos/animated-file-upload/docs";
import AnimatedFileUploadVariantsDemo from "@/demos/animated-file-upload/variants";
import type { ComponentDoc } from "./registry.types";

export const ANIMATED_FILE_UPLOAD_DOC: ComponentDoc = {
  slug: "animated-file-upload",
  name: "Animated File Upload",
  description:
    "支持拖拽高光、紧凑条模式、视觉变体、类型与体积校验、图片缩略图、适配器上传进度与弹簧列表动效的极简文件上传组件。",
  category: "forms",
  registryName: "animated-file-upload",
  dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { AnimatedFileUpload } from "@/components/ui/animated-file-upload";

export function Demo() {
  return <AnimatedFileUpload variant="default" accept="image/*,.pdf" maxSize={10 * 1024 * 1024} />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "animated-file-upload-basic",
      name: "拖拽上传与实时进度",
      description:
        "拖入高亮虚线框，展示体积与份数徽章，选中文件后通过 uploadAdapter 汇报底部进度条。",
      file: "animated-file-upload/basic.tsx",
      Demo: AnimatedFileUploadBasic,
    },
    {
      slug: "variants",
      name: "紧凑条模式、填充风格与校验态",
      description:
        "展示 compact 横向上传条（适合窄栏与表单行）、filled 填充风与外部 error 校验态。",
      file: "animated-file-upload/variants.tsx",
      Demo: AnimatedFileUploadVariantsDemo,
      directory: false,
    },
    {
      slug: "docs",
      name: "限制类型与大小的规范文档上传",
      description: "通过 accept、maxFiles 与 maxSize 限制上传格式，拦截超规文件并给出清晰提示。",
      file: "animated-file-upload/docs.tsx",
      Demo: AnimatedFileUploadDocsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant / compact",
      type: '"default" | "filled" | "minimal" / boolean',
      defaultValue: '"default" / false',
      description: "拖拽区表面风格（虚线框 / 柔灰填充 / 极简实线）与紧凑横向条模式。",
    },
    {
      name: "uploadAdapter",
      type: "(file: File, helpers: { onProgress, signal }) => Promise<void>",
      defaultValue: "-",
      description: "外部注入的上传适配器，负责与业务后端交互并汇报进度。",
    },
    {
      name: "accept",
      type: "string",
      defaultValue: "-",
      description: "允许的 MIME 类型或扩展名（逗号分隔）。",
    },
    {
      name: "maxSize / maxFiles / showMetaBadges",
      type: "number / number / boolean",
      defaultValue: "- / - / true",
      description: "单文件最大字节数、最多允许文件数量以及是否在拖拽区展示限制徽章。",
    },
    {
      name: "error / multiple",
      type: "string / boolean",
      defaultValue: "- / true",
      description: "外部表单校验错误提示，以及是否允许多文件上传。",
    },
    {
      name: "onFilesChange",
      type: "(files: UploadFileItem[]) => void",
      defaultValue: "-",
      description: "文件列表或状态变化时回调。",
    },
  ],
  accessibility: [
    "拖拽区本身为原生 button，支持 Tab 聚焦与 Enter/Space 唤起系统文件选择器。",
    '校验失败或外部 error 提示使用 role="alert" 实时播报，失败行提供具名重试与移除按钮。',
    "组件卸载或移除文件时自动调用 AbortController 中止上传并释放 createObjectURL 内存，遵守减弱动效偏好。",
  ],
};
