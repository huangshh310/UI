export type AiStackTraceVariant = "card" | "seamless";

export interface AiStackCommand {
  /** 执行的命令文本 */
  command: string;
  /** 退出码（非 0 显示红色 exit N） */
  exitCode?: number;
  /** 执行耗时（如 1.8s） */
  duration?: string;
}

export interface AiStackCodeLine {
  lineNumber: number;
  content: string;
  highlight?: boolean;
}

export interface AiStackCodeSnippet {
  file: string;
  lines: AiStackCodeLine[];
}

export interface AiStackFrame {
  id: string;
  /** 函数名（可选，如 async getUsers） */
  fn?: string;
  /** 文件与行列位置（如 lib/users.ts:10:26） */
  location: string;
  /** 是否属于框架/运行时内部帧（默认折叠归组） */
  framework?: boolean;
  /** 框架名分组标识（如 next） */
  frameworkLabel?: string;
  /** 内嵌源码上下文预览 */
  snippet?: AiStackCodeSnippet;
}

export interface AiStackCause {
  name: string;
  code?: string;
  message: string;
}

export interface AiStackTraceProps {
  /** 可选顶部命令执行摘要行（如 Ran curl -sf ... exit 22） */
  command?: AiStackCommand | null;
  /** 错误类型名（如 TypeError） */
  errorName?: string;
  /** 错误消息（如 fetch failed） */
  errorMessage?: string;
  /** 调用栈帧列表 */
  frames?: AiStackFrame[];
  /** 折叠框架帧总数提示（默认按 framework 帧数计算） */
  frameworkFrameCount?: number;
  /** 框架分组标签（如 next） */
  frameworkGroupLabel?: string;
  /** 底层根因链（Caused by） */
  cause?: AiStackCause | null;
  /** 是否默认展开堆栈卡片，默认 true */
  defaultOpen?: boolean;
  /** 容器风格：card 或 seamless */
  variant?: AiStackTraceVariant;
  /** 点击“请求修复”回调 */
  onAskFix?: (payload: { name: string; message: string }) => void;
  /** 点击复制堆栈回调 */
  onCopy?: (rawTrace: string) => void;
  /** 自定义类名 */
  className?: string;
}
