/**
 * CodeSnippetDeck 的类型定义。
 */
import type { VariantProps } from "class-variance-authority";
import type { deckOuterVariants } from "./code-snippet-deck.variants.js";

export type CodeSnippetDeckVariant = NonNullable<VariantProps<typeof deckOuterVariants>["variant"]>;

/** 一种语言的代码模板。模板中的 {{参数名}} 会被替换为参数的当前值 */
export interface Snippet {
  /** 唯一标识，例如 "python" */
  language: string;
  /** 页签上显示的名称 */
  label: string;
  /** 可选文件名（例如 "request.sh" / "client.ts"），优先于全局 title 展示 */
  filename?: string;
  code: string;
}

/** 一个可编辑的参数 */
export interface SnippetParameter {
  /** 模板中引用的名字 */
  name: string;
  /** 输入框的标签 */
  label: string;
  defaultValue: string;
  /** 输入框占位提示 */
  placeholder?: string;
  /** 可选快捷预设值列表，点击芯片即可快速代入 */
  options?: string[];
}

export interface CodeSnippetDeckProps {
  snippets: Snippet[];
  parameters?: SnippetParameter[];
  /** 视觉风格：编辑卡、曜石黑终端、双层浮雕画框或极简命令条 */
  variant?: CodeSnippetDeckVariant;
  /** 顶部标题或接口路径（例如 "/v1/projects"） */
  title?: string;
  /** 顶部标题前的紧凑徽章（例如 "GET" / "POST" / "CLI"） */
  badge?: string;
  /** 是否显示顶部的窗口装饰点，默认显示（minimal 变体默认隐藏） */
  showWindowBar?: boolean;
  /** 是否在左侧显示代码行号（不污染复制内容与 textContent） */
  showLineNumbers?: boolean;
  /** 是否高亮代码中由参数实时代入的片段，并在聚焦参数框时联动高亮，默认开启 */
  highlightParameters?: boolean;
  /** 默认是否开启自动换行 */
  wrapLines?: boolean;
  /** 是否在顶栏展示自动换行切换按钮 */
  allowWrapToggle?: boolean;
  /** 受控当前语言标识 */
  language?: string;
  /** 非受控初始语言标识 */
  defaultLanguage?: string;
  /** 切换语言页签时的回调 */
  onLanguageChange?: (language: string) => void;
  /** 点击复制按钮后的回调 */
  onCopy?: (code: string, language: string) => void;
  className?: string;
}
