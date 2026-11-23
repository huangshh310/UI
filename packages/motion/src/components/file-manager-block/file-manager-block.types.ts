import type { SelectionBasketVariant } from "../selection-basket/index.js";

export type FileManagerBlockVariant = "default" | "elevated" | "minimal";

export interface ManagedFileEntry {
  id: string;
  name: string;
  folder: string;
  sizeLabel: string;
  updatedAt: string;
}

export interface FileManagerBlockProps {
  /** 初始文件列表 */
  initialFiles?: ManagedFileEntry[];
  /** 区块主标题，默认「组件资产库」 */
  title?: string;
  /** 区块副标题说明 */
  description?: string;
  /** 外框视觉风格：标准发丝描边、浮层阴影或极简低噪 */
  variant?: FileManagerBlockVariant;
  /** 底部 SelectionBasket 浮舱样式 */
  basketVariant?: SelectionBasketVariant;
  /** 紧凑密度模式 */
  compact?: boolean;
  /** 批量删除完成后的回调 */
  onDeleteFiles?: (deletedIds: string[]) => void;
  /** 自定义类名 */
  className?: string;
}
