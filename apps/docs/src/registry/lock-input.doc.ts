/**
 * Lock Input 的文档数据。
 */
import { LockInputBasic } from "@/demos/lock-input/basic";
import LockInputErrorDemo from "@/demos/lock-input/error";
import type { ComponentDoc } from "./registry.types";

export const LOCK_INPUT_DOC: ComponentDoc = {
  slug: "lock-input",
  name: "Lock Input",
  description: "聚焦时聚焦环由中心收拢锁定到边框上的输入框，支持前后缀、错误提示与锁定只读态。",
  category: "forms",
  registryName: "lock-input",
  dependencies: ["lucide-react", "clsx", "tailwind-merge"],
  usage: `import { LockInput } from "@/components/ui/lock-input";

export function Demo() {
  return <LockInput label="工作邮箱" placeholder="you@studio.dev" />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "lock-input-basic",
      name: "聚焦锁定与只读态",
      description: "聚焦时柔和焦点环向边框收拢；locked 模式自动转为只读并展示锁图标。",
      file: "lock-input/basic.tsx",
      Demo: LockInputBasic,
    },
    {
      slug: "error",
      name: "只读锁定态与错误校验态",
      description: "展示带图标前缀的只读密钥锁定框，以及触发 aria-invalid 的错误提示。",
      file: "lock-input/error.tsx",
      Demo: LockInputErrorDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "label",
      type: "string",
      defaultValue: "-",
      description: "输入框上方标签，自动关联 id。",
    },
    {
      name: "hint",
      type: "string",
      defaultValue: "-",
      description: "辅助说明，无错误时作为 aria-describedby。",
    },
    {
      name: "error",
      type: "string",
      defaultValue: "-",
      description: "错误提示，触发 aria-invalid 与 alert 播报。",
    },
    {
      name: "locked",
      type: "boolean",
      defaultValue: "false",
      description: "锁定态：只读并展示锁图标。",
    },
    {
      name: "prefix / suffix",
      type: "ReactNode",
      defaultValue: "-",
      description: "输入框左右附加内容。",
    },
  ],
  accessibility: [
    "基于原生 input，自动通过 htmlFor 与 aria-describedby 关联标签、说明和错误提示。",
    '错误态通过 role="alert" 与 aria-invalid="true" 通知辅助技术。',
    "减少动态效果时焦点环过渡自动压缩，不依赖动画表达焦点。",
  ],
};
