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
  /** 自定义类名 */
  className?: string;
}
