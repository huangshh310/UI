import type { ReactNode } from "react";

export type AiArtifactTab = "preview" | "code";

export interface AiArtifactProps {
  /** 产物标题 */
  title: string;
  /** 版本与栈标签 */
  version?: string;
  /** 可选多版本切换列表 */
  versions?: string[];
  /** 代码语言标识 */
  language?: string;
  /** 完整源码文本 */
  code: string;
  /** 实时渲染的预览内容 */
  preview: ReactNode;
  /** 初始展示的页签 */
  defaultTab?: AiArtifactTab;
  /** 复制源码回调 */
  onCopy?: (code: string) => void;
  /** 自定义类名 */
  className?: string;
}
