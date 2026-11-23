/**
 * Lock Input 的文档数据。
 */
import { LockInputBasic } from "@/demos/lock-input/basic";
import LockInputErrorDemo from "@/demos/lock-input/error";
import { LockInputInteractive } from "@/demos/lock-input/interactive";
import { LockInputSizes } from "@/demos/lock-input/sizes";
import { LockInputVariants } from "@/demos/lock-input/variants";
import type { ComponentDoc } from "./registry.types";

export const LOCK_INPUT_DOC: ComponentDoc = {
  slug: "lock-input",
  name: "Lock Input",
  description:
    "聚焦时聚焦环由中心收拢锁定到边框上的输入框，提供多种视觉变体、尺寸、圆角与可切换锁定、一键复制、一键清空、密码显隐和字数统计能力。",
  category: "forms",
  registryName: "lock-input",
  dependencies: ["class-variance-authority", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { LockInput } from "@/components/ui/lock-input";

export function Demo() {
  return (
    <LockInput
      label="工作邮箱"
      placeholder="you@studio.dev"
      clearable
    />
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "lock-input-basic",
      name: "聚焦锁定与只读复制",
      description: "聚焦时焦点环向边框平滑收拢锁定；支持清空按钮与等宽只读锁定复制态。",
      file: "lock-input/basic.tsx",
      Demo: LockInputBasic,
    },
    {
      slug: "variants",
      name: "视觉变体、圆角与锁定环配色",
      description:
        "涵盖 default、filled、ghost、underline 四种外观，以及胶囊圆角（radius=full）与中性单色焦点环。",
      file: "lock-input/variants.tsx",
      Demo: LockInputVariants,
      directory: false,
    },
    {
      slug: "sizes",
      name: "尺寸规格、前后缀与快捷键角标",
      description: "提供 sm、md、lg 三档尺寸，支持图标或文本前后缀以及键盘快捷键提示。",
      file: "lock-input/sizes.tsx",
      Demo: LockInputSizes,
      directory: false,
    },
    {
      slug: "interactive",
      name: "可切换锁定、密钥显隐与字数统计",
      description:
        "支持点击锁图标在只读与可编辑间切换、密码/令牌明文切换、一键复制与底部字数计数。",
      file: "lock-input/interactive.tsx",
      Demo: LockInputInteractive,
      directory: false,
    },
    {
      slug: "error",
      name: "只读锁定、错误校验与禁用态",
      description: "展示生产密钥锁定复制、触发 aria-invalid 的错误校验态以及禁用态。",
      file: "lock-input/error.tsx",
      Demo: LockInputErrorDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"default" | "filled" | "ghost" | "underline"',
      defaultValue: '"default"',
      description: "输入框视觉风格：卡片描边、柔灰填充、极简透明或底部基线。",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "输入框尺寸规格。",
    },
    {
      name: "radius",
      type: '"md" | "lg" | "full"',
      defaultValue: '"lg"',
      description: "外框圆角规格（underline 变体始终保持直角底线）。",
    },
    {
      name: "ringTone",
      type: '"signal" | "neutral"',
      defaultValue: '"signal"',
      description: "聚焦锁定环配色倾向：品牌信号色或纯中性单色。",
    },
    {
      name: "mono",
      type: "boolean",
      defaultValue: "false",
      description: "使用等宽数字字体，适合项目 ID、API Key、域名与 Token。",
    },
    {
      name: "label / labelExtra",
      type: "string / ReactNode",
      defaultValue: "-",
      description: "输入框上方标签（自动关联 id）及右侧补充信息（如必填标记或状态提示）。",
    },
    {
      name: "hint / error",
      type: "string",
      defaultValue: "-",
      description: "底部辅助说明与错误提示；传入 error 时触发 aria-invalid 与 alert 播报。",
    },
    {
      name: "locked / defaultLocked",
      type: "boolean",
      defaultValue: "false",
      description: "锁定为只读并展示锁图标；支持受控与非受控模式。",
    },
    {
      name: "lockable / onLockedChange",
      type: "boolean / (locked: boolean) => void",
      defaultValue: "false",
      description: "允许点击右侧锁图标切换锁定与可编辑状态，并触发回调。",
    },
    {
      name: "clearable / onClear",
      type: "boolean / () => void",
      defaultValue: "false",
      description: "可编辑且存在内容时显示清空按钮，点击后清空并归还焦点。",
    },
    {
      name: "copyable / onCopy",
      type: "boolean / (value: string) => void",
      defaultValue: "false",
      description: "显示一键复制按钮并附带确认图标反馈。",
    },
    {
      name: "revealable",
      type: "boolean",
      defaultValue: "false",
      description: '当 type="password" 时显示明文/密文切换按钮。',
    },
    {
      name: "showCount",
      type: "boolean",
      defaultValue: "false",
      description: "在底部展示字数统计，传入 maxLength 时自动显示「当前 / 上限」。",
    },
    {
      name: "shortcut",
      type: "string",
      defaultValue: "-",
      description: "右侧键盘快捷键提示角标（如 ⌘K）。",
    },
    {
      name: "prefix / suffix",
      type: "ReactNode",
      defaultValue: "-",
      description: "输入框左右附加内容（图标、协议头或单位）。",
    },
  ],
  accessibility: [
    "基于原生 input，自动通过 htmlFor 与 aria-describedby 关联标签、说明和错误提示。",
    '错误态通过 role="alert" 与 aria-invalid="true" 通知辅助技术。',
    "锁切换、显隐切换、清空与复制微按钮均提供语义化 aria-label 与 aria-pressed 状态。",
    "减少动态效果时焦点环过渡自动压缩，不依赖动画表达焦点。",
  ],
};
