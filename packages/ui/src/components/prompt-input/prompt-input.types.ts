/**
 * PromptInput 的类型定义：器物级多模态对话输入器，兼顾开箱即用 Props 与复合子部件拼装。
 */
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export interface PromptAttachment {
  id: string;
  name: string;
  size?: string;
  /** 附件类型提示，用于渲染区分图标或状态 */
  kind?: "file" | "image" | "code";
}

export interface PromptContextRef {
  id: string;
  /** 上下文引用标签（如 @tokens.css、@docs） */
  label: string;
}

export interface PromptSlashCommand {
  id: string;
  /** 斜杠命令名（不含前导斜杠，如 "review"） */
  command: string;
  /** 命令标题或简述 */
  description: string;
  /** 选中后回填的模板文本（省略时回填 `/command `） */
  template?: string;
}

export interface PromptModelOption {
  id: string;
  label: string;
}

export type PromptInputStatus = "idle" | "submitting" | "streaming" | "disabled";

export interface PromptInputProps {
  /** 受控输入值 */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  /** 内容变更回调 */
  onValueChange?: (value: string) => void;
  /** 提交回调（Enter 或点击发送按钮） */
  onSubmit?: (value: string) => void;
  /** 生成中继续提交时进入排队栈的回调（传入后 streaming 状态下输入非空文本可加入队列） */
  onQueue?: (value: string) => void;
  /** 生成中点击停止按钮的回调 */
  onStop?: () => void;
  /** 当前运行状态 */
  status?: PromptInputStatus;
  /** 输入框占位提示 */
  placeholder?: string;
  /** 最大字符数，传入时在工具栏显示字数统计 */
  maxLength?: number;
  /** 已附加文件列表 */
  attachments?: PromptAttachment[];
  /** 移除附件回调 */
  onRemoveAttachment?: (id: string) => void;
  /** 点击添加附件图标的回调 */
  onAttach?: () => void;
  /** 已关联的 @ 上下文引用胶囊 */
  contextRefs?: PromptContextRef[];
  /** 移除 @ 上下文引用回调 */
  onRemoveContextRef?: (id: string) => void;
  /** 输入 `/` 前缀时呼出的快捷指令列表 */
  slashCommands?: PromptSlashCommand[];
  /** 选中斜杠指令回调 */
  onSelectSlashCommand?: (cmd: PromptSlashCommand) => void;
  /** 可选模型/模式胶囊列表 */
  models?: PromptModelOption[];
  /** 当前选中的模型 ID */
  selectedModel?: string;
  /** 模型切换回调 */
  onModelChange?: (id: string) => void;
  /** 输入器下方的快捷提示词建议 */
  suggestions?: string[];
  /** 点击快捷提示词时的回调 */
  onSelectSuggestion?: (text: string) => void;
  /** 底部工具栏左侧自定义插槽（可嵌入 ModelSelector、Context 等紧凑组件） */
  toolbarLeft?: ReactNode;
  /** 底部工具栏右侧附加插槽（位于发送按钮左侧，如语音输入按钮） */
  toolbarRight?: ReactNode;
  /** 卡片下方的键盘辅助说明 */
  hint?: string;
  /** 复合子部件模式：传入 children 时按复合结构自由编排内部区域 */
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export interface PromptInputHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export interface PromptInputFooterProps extends HTMLAttributes<HTMLDivElement> {}
export interface PromptInputToolsProps extends HTMLAttributes<HTMLDivElement> {}
export interface PromptInputTextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
> {}
export interface PromptInputSubmitProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
