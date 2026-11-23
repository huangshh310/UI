import type { ReactNode } from "react";

export type AiArtifactTab = "preview" | "code";
export type AiArtifactVariant = "card" | "split" | "compact";
export type AiArtifactPreviewSurface = "plain" | "grid" | "obsidian";

export interface AiArtifactProps {
  /** 产物标题 */
  title: string;
  /** 容器布局形态：页签切换（card）、分栏对照（split）或紧凑卡片（compact） */
  variant?: AiArtifactVariant;
  /** 预览画布底纹：纯净底面（plain）、微点阵网格（grid）或暗色曜石（obsidian） */
  previewSurface?: AiArtifactPreviewSurface;
  /** 版本与栈标签 */
  version?: string;
  /** 可选多版本切换列表 */
  versions?: string[];
  /** 代码语言标识 */
  language?: string;
  /** 是否在源码视图显示行号 */
  showLineNumbers?: boolean;
  /** 完整源码文本 */
  code: string;
  /** 实时渲染的预览内容 */
  preview?: ReactNode;
  /** 初始展示的页签 */
  defaultTab?: AiArtifactTab;
  /** 切换版本回调 */
  onVersionChange?: (version: string) => void;
  /** 切换页签回调 */
  onTabChange?: (tab: AiArtifactTab) => void;
  /** 复制源码回调 */
  onCopy?: (code: string) => void;
  /** 可选下载源码回调（传入时在工具栏显示下载按钮） */
  onDownload?: (code: string) => void;
  /** 自定义类名 */
  className?: string;
}
