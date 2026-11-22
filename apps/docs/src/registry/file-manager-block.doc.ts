import FileManagerBlockBasicDemo from "@/demos/file-manager-block/basic";
import FileManagerBlockReleasesDemo from "@/demos/file-manager-block/releases";
import type { ComponentDoc } from "./registry.types";

export const FILE_MANAGER_BLOCK_DOC: ComponentDoc = {
  slug: "file-manager-block",
  name: "File Manager Block",
  description: "由 AnimatedFileUpload 与 SelectionBasket 组合的文件资产管理区块。",
  category: "blocks",
  registryName: "file-manager-block",
  dependencies: ["lucide-react", "motion"],
  usage: `import { FileManagerBlock } from "@/components/ui/file-manager-block";

<FileManagerBlock />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "文件上传与批量管理",
      description: "支持折叠拖拽上传区、目录概览卡、文件多选以及底部 SelectionBasket 批量删除。",
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
  ],
  api: [
    {
      name: "initialFiles",
      type: "ManagedFileEntry[]",
      defaultValue: "内置示例",
      description: "初始文件条目列表",
    },
  ],
  accessibility: [
    "每条文件复选框带独立 aria-label，选中数量变动由 SelectionBasket 的 aria-live 自动播报。",
  ],
};
