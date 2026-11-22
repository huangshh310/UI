export interface AiPromptTemplate {
  id: string;
  category: string;
  title: string;
  prompt: string;
  tone: "signal" | "violet" | "emerald" | "amber";
}

export interface AiPromptGalleryProps {
  /** 提示词模板卡片列表 */
  templates?: AiPromptTemplate[];
  /** 点击模板卡片回调 */
  onSelect?: (template: AiPromptTemplate) => void;
  /** 自定义类名 */
  className?: string;
}
