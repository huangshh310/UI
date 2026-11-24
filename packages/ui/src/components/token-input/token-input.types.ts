/**
 * TokenInput 的公开类型定义：内联原子化上下文标签与富提示词编辑契约。
 */
import type { ReactNode } from "react";

export type ContextTokenTone = "default" | "signal" | "success" | "warning";

export interface ContextToken {
  id?: string;
  type: string;
  value: string;
  label: string;
  tone?: ContextTokenTone;
  status?: "idle" | "loading" | "done";
}

export type TokenInputSegment = string | ContextToken;

export interface TokenTriggerItem {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  keywords?: string[];
  disabled?: boolean;
}

export interface TokenTriggerSource {
  char: string;
  type: string;
  boundary?: "start" | "line" | "word" | "anywhere";
  items: TokenTriggerItem[];
}

export type TokenDeletionMode = "whole" | "select" | "revert";

export interface TokenInputProps {
  /** 受控混合片段数组 */
  value?: TokenInputSegment[];
  /** 非受控初始混合片段数组 */
  defaultValue?: TokenInputSegment[];
  /** 内容变更回调（同时回传结构化数组与纯文本序列化串） */
  onValueChange?: (value: TokenInputSegment[], serialized: string) => void;
  /** 快捷键或提交回调 */
  onSubmit?: (value: TokenInputSegment[], serialized: string) => void;
  /** 可选内联触发源（如键入 @ 插入文件胶囊、键入 / 插入指令胶囊） */
  triggers?: TokenTriggerSource[];
  /** 退格键遇到胶囊时的行为：整块删除、先选中再删或还原为纯文本 */
  tokenDeletion?: TokenDeletionMode;
  /** 提交快捷键：enter 单回车提交或 mod+enter 组合键提交 */
  submitShortcut?: "enter" | "mod+enter";
  placeholder?: string;
  emptyText?: string;
  label?: string;
  hint?: string;
  error?: string;
  ariaLabel?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** 是否在胶囊右侧展示删除按钮，默认 true */
  removable?: boolean;
  variant?: "default" | "subtle";
  /** 底部工具栏插槽 */
  footer?: ReactNode;
  className?: string;
}
