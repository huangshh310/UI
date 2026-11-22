/**
 * PromptInput 组件的类型定义。
 */
import type { ReactNode } from "react";

export interface PromptAttachment {
  id: string;
  name: string;
  size?: string;
}

export interface PromptModelOption {
  id: string;
  label: string;
}

export type PromptInputStatus = "idle" | "streaming" | "disabled";

export interface PromptInputProps {
  /** 受控输入值 */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  /** 内容变更回调 */
  onValueChange?: (value: string) => void;
  /** 提交回调（Enter 或点击发送按钮） */
  onSubmit?: (value: string) => void;
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
  /** 底部工具栏左侧自定义插槽 */
  toolbarLeft?: ReactNode;
  /** 卡片下方的键盘辅助说明 */
  hint?: string;
  className?: string;
  "aria-label"?: string;
}
