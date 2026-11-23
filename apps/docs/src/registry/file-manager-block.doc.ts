import FileManagerBlockBasicDemo from "@/demos/file-manager-block/basic";
import FileManagerBlockCompactDemo from "@/demos/file-manager-block/compact";
import FileManagerBlockReleasesDemo from "@/demos/file-manager-block/releases";
import type { ComponentDoc } from "./registry.types";

export const FILE_MANAGER_BLOCK_DOC: ComponentDoc = {
  slug: "file-manager-block",
  name: "File Manager Block",
  description:
    "由 AnimatedFileUpload 与 SelectionBasket 组合的文件资产管理区块，支持目录交互筛选、文件扩展名识别与批量操作浮舱。",
  category: "blocks",
  registryName: "file-manager-block",
  dependencies: ["lucide-react", "motion"],
  usage: `import { FileManagerBlock } from "@/components/ui/file-manager-block";

<FileManagerBlock variant="elevated" basketVariant="inverted" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "文件上传与批量管理",
      description:
        "支持折叠拖拽上传区、可点击筛选的目录概览卡、表头对齐文件列表以及底部 SelectionBasket 批量删除。",
      file: "file-manager-block/basic.tsx",
      Demo: FileManagerBlockBasicDemo,
    },
    {
      slug: "releases",
      name: "发布产物与门禁报告管理",
      description: "传入 initialFiles 展示 npm 产物与审计报告的勾选与批量删除流。",
      file: "file-manager-block/releases.tsx",
      Demo: FileManagerBlockReleasesDemo,
      directory: false,
    },
    {
      slug: "compact",
      name: "浮层阴影与反色浮舱紧凑模式",
      description:
        '通过 variant="elevated"、basketVariant="inverted" 与 compact 打造高密度设计资产管理面板。',
      file: "file-manager-block/compact.tsx",
      Demo: FileManagerBlockCompactDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "initialFiles",
      type: "ManagedFileEntry[]",
      defaultValue: "内置示例",
      description: "初始文件条目列表",
    },
    {
      name: "title",
      type: "string",
      defaultValue: '"组件资产库"',
      description: "区块主标题",
    },
    {
      name: "description",
      type: "string",
      defaultValue: "内置描述",
      description: "区块副标题说明",
    },
    {
      name: "variant",
      type: '"default" | "elevated" | "minimal"',
      defaultValue: '"default"',
      description: "容器外框与阴影层级变体",
    },
    {
      name: "basketVariant",
      type: '"default" | "inverted" | "glass"',
      defaultValue: '"default"',
      description: "底部 SelectionBasket 批量操作浮舱风格",
    },
    {
      name: "compact",
      type: "boolean",
      defaultValue: "false",
      description: "紧凑密度模式",
    },
    {
      name: "onDeleteFiles",
      type: "(deletedIds: string[]) => void",
      defaultValue: "—",
      description: "批量删除条目完成后的回调",
    },
  ],
  accessibility: [
    "目录筛选卡片使用 aria-pressed 声明激活态，每条文件复选框带独立 aria-label。",
    "选中数量变动由 SelectionBasket 的 aria-live 自动播报，空视图提供一键恢复筛选按钮。",
  ],
};
