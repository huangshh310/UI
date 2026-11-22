/**
 * 展示站清单的类型定义。
 * 清单描述「有哪些组件、每个组件有哪些示例」，目录页与详情页都从它生成。
 */
import type { ComponentType } from "react";

/** 目录页的分类 */
export type CategoryId = "buttons" | "forms";

/** 目录页签的取值：全部、最近收录，或某个分类 */
export type DirectoryFilter = "all" | "recent" | CategoryId;

export interface Category {
  id: CategoryId;
  label: string;
}

/** 一个示例：一段可运行、可展示源码的组件用法 */
export interface Specimen {
  /** 在所属组件内唯一，同时用作详情页的锚点 */
  slug: string;
  name: string;
  description: string;
  /** 源码文件，相对于 src/demos */
  file: string;
  /** 实时渲染的示例组件 */
  Demo: ComponentType;
}

/** API 表格中的一行 */
export interface ApiProp {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

/** 一个组件的完整文档数据 */
export interface ComponentDoc {
  slug: string;
  name: string;
  description: string;
  category: CategoryId;
  /** 在 shadcn Registry 中的条目名，也是 CLI 安装命令的最后一段 */
  registryName: string;
  /** 手动安装时需要的 npm 依赖 */
  dependencies: string[];
  /** 最小用法示例的源码 */
  usage: string;
  /** 收录日期（YYYY-MM-DD），用于「最近」页签与 NEW 标记 */
  createdAt: string;
  specimens: Specimen[];
  api: ApiProp[];
  accessibility: string[];
}
