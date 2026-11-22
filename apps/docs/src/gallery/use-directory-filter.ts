/**
 * 目录页的筛选状态：搜索关键字与分类。
 */
import { useMemo, useState } from "react";
import { DIRECTORY, type DirectoryEntry } from "@/registry/registry";
import type { CategoryId } from "@/registry/registry.types";

/** 分类页签的取值：某个分类，或「全部」 */
export type CategoryFilter = CategoryId | "all";

/** 示例是否匹配关键字：名称、说明、所属组件名任一包含即可，忽略大小写 */
const matchesQuery = ({ specimen, component }: DirectoryEntry, query: string) =>
  [specimen.name, specimen.description, component.name]
    .join(" ")
    .toLowerCase()
    .includes(query.trim().toLowerCase());

export const useDirectoryFilter = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const entries = useMemo(
    () =>
      DIRECTORY.filter(
        (entry) =>
          (category === "all" || entry.component.category === category) &&
          matchesQuery(entry, query),
      ),
    [query, category],
  );

  return { query, setQuery, category, setCategory, entries };
};
