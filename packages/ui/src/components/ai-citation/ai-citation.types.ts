export interface AiCitationSource {
  id: string;
  index: number;
  title: string;
  domain: string;
  snippet: string;
  score?: string;
  badge?: string;
}

export interface AiCitationProps {
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
