"use client";

/**
 * 把可排序列表的行为原语渲染为 React 组件。
 * createParts 为原语的每个 slot 生成一个组件，这里指定各自渲染的 HTML 元素。
 */
import { createParts } from "@ui-sdk/react/primitive";
import { sortableList } from "./sortable-list";

export const { Root: SortableList, Item: SortableItem } = createParts(sortableList, {
  root: "ul",
  item: "li",
});
