/**
 * 展示站清单的类型定义。
 * 清单描述「有哪些组件、每个组件有哪些示例」，目录页与详情页都从它生成。
 */
import type { ComponentType } from "react";

/** 目录页的分类 */
export type CategoryId = "buttons";

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
  /** 在目录网格中占两列，留给内容较宽的示例 */
  wide?: boolean;
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
  /** 安装命令 */
  install: string;
  specimens: Specimen[];
  api: ApiProp[];
  accessibility: string[];
}
