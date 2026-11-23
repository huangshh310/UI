import MessageBasicDemo from "@/demos/message/basic";
import MessageMetadataDemo from "@/demos/message/metadata";
import MessageStatesDemo from "@/demos/message/states";
import type { ComponentDoc } from "./registry.types";

export const MESSAGE_DOC: ComponentDoc = {
  slug: "message",
  name: "Message",
  description:
    "单回合对话复合组件，提供无框助手流式正文、温润用户胶囊、元信息头、多版本分支切换、原位编辑与异常重试。",
  category: "ai",
  registryName: "message",
  dependencies: ["class-variance-authority", "lucide-react", "clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";

export function Example() {
  return (
    <Message from="assistant" model="Claude 4.5">
      <MessageContent>你好！今天想构建什么组件？</MessageContent>
    </Message>
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "无框对话回合、原位编辑与分支切换",
      description:
        "用户胶囊悬停可原位编辑重发，助手无框正文集成模型元信息、复制、赞踩反馈与 < 1/2 > 分支切换。",
      file: "message/basic.tsx",
      Demo: MessageBasicDemo,
    },
    {
      slug: "states",
      name: "系统提示、生成停止与失败重试状态",
      description: "内置系统居中胶囊、流式光标、主动停止标签以及高对比错误重试横幅。",
      file: "message/states.tsx",
      Demo: MessageStatesDemo,
      directory: false,
    },
    {
      slug: "metadata",
      name: "极简左对齐流与头像元信息头",
      description:
        "通过 variant='flat' 与 author / model / avatar 构建 Linear / IDE 侧栏风格会话。",
      file: "message/metadata.tsx",
      Demo: MessageMetadataDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "from / variant",
      type: '"user" | "assistant" | "system" / "default" | "compact" | "flat"',
      defaultValue: '— / "default"',
      description: "消息发送方角色与排版视觉风格（经典气泡、紧凑侧栏或全左对齐流）。",
    },
    {
      name: "status / errorMessage / onRetry",
      type: '"ready" | "streaming" | "stopped" | "error" / string / () => void',
      defaultValue: '"ready" / — / —',
      description: "当前回合的生成状态、异常说明与一键重试回调。",
    },
    {
      name: "author / model / timestamp / avatar",
      type: "string / string / string / ReactNode",
      defaultValue: "—",
      description: "可选头部元信息行，传入任意一项即自动渲染作者、等宽模型徽章与时间。",
    },
    {
      name: "MessageBranch / MessageBranchSelector",
      type: "Compound Components",
      defaultValue: "—",
      description: "管理并切换同一回合下的多个候选回复分支。",
    },
    {
      name: "MessageEditForm",
      type: "Compound Component",
      defaultValue: "—",
      description: "用户消息原位编辑表单，支持 Escape 取消与 Cmd/Ctrl+Enter 提交。",
    },
  ],
  accessibility: [
    "所有图标操作按钮强制要求传入中文 label 属性生成 aria-label，激活态暴露 aria-pressed。",
    "revealOnHover 模式下键盘 focus-within 同样立即显露操作栏，不阻断纯键盘用户。",
  ],
};
