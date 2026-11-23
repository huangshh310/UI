import MessageBasicDemo from "@/demos/message/basic";
import MessageStatesDemo from "@/demos/message/states";
import type { ComponentDoc } from "./registry.types";

export const MESSAGE_DOC: ComponentDoc = {
  slug: "message",
  name: "Message",
  description:
    "单回合对话复合组件，提供无框助手流式正文、温润用户胶囊、多版本分支切换、原位编辑与异常重试。",
  category: "ai",
  registryName: "message",
  dependencies: ["lucide-react", "clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";

export function Example() {
  return (
    <Message from="assistant">
      <MessageContent>你好！今天想构建什么组件？</MessageContent>
    </Message>
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "无框对话回合、原位编辑与分支切换",
      description:
        "用户胶囊悬停可原位编辑重发，助手无框正文底部集成复制、赞踩反馈与 < 1/2 > 分支切换。",
      file: "message/basic.tsx",
      Demo: MessageBasicDemo,
    },
    {
      slug: "states",
      name: "生成停止与失败重试状态",
      description: "内置流式光标、主动停止标签以及可一键恢复连接的错误横幅。",
      file: "message/states.tsx",
      Demo: MessageStatesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "from",
      type: '"user" | "assistant" | "system"',
      defaultValue: "—",
      description: "消息发送方角色，决定对齐方式与表面形态。",
    },
    {
      name: "status",
      type: '"ready" | "streaming" | "stopped" | "error"',
      defaultValue: '"ready"',
      description: "当前回合的生成状态。",
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
