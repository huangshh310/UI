export type AiCitationVariant = "card" | "popover" | "inline";

export interface AiCitationSource {
  id: string;
  index: number;
  title: string;
  domain: string;
  snippet: string;
  score?: string;
  badge?: string;
  /** 可选原文链接地址 */
  url?: string;
  /** 可选文档更新或发布时间 */
  publishedAt?: string;
}

export interface AiCitationProps {
  /** 视觉布局形态：标准溯源卡（card）、磨砂浮层预览（popover）或极简内联条（inline） */
  variant?: AiCitationVariant;
  /** 可选 AI 回答正文（展示行内角标与下方来源卡片的联动上下文） */
  answer?: string;
  /** 检索到的知识源列表 */
  sources?: AiCitationSource[];
  /** 初始激活的来源 ID */
  defaultActiveId?: string;
  /** 切换来源回调 */
  onSelect?: (source: AiCitationSource) => void;
  /** 自定义类名 */
  className?: string;
}
