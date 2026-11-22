/**
 * CodeSnippetDeck 的类型定义。
 */

/** 一种语言的代码模板。模板中的 {{参数名}} 会被替换为参数的当前值 */
export interface Snippet {
  /** 唯一标识，例如 "python" */
  language: string;
  /** 页签上显示的名称 */
  label: string;
  code: string;
}

/** 一个可编辑的参数 */
export interface SnippetParameter {
  /** 模板中引用的名字 */
  name: string;
  /** 输入框的标签 */
  label: string;
  defaultValue: string;
}

export interface CodeSnippetDeckProps {
  snippets: Snippet[];
  parameters?: SnippetParameter[];
  /** 是否显示顶部的窗口栏，默认显示 */
  showWindowBar?: boolean;
  className?: string;
}
