/**
 * 目录页的筛选状态：搜索关键字与页签（全部、最近、某个分类）。
 */
import { useMemo, useState } from "react";
import { DIRECTORY, type DirectoryEntry } from "@/registry/registry";
import type { DirectoryFilter } from "@/registry/registry.types";

/** 示例是否匹配关键字：名称、说明、所属组件名任一包含即可，忽略大小写 */
const matchesQuery = ({ specimen, component }: DirectoryEntry, query: string) =>
  [specimen.name, specimen.description, component.name]
    .join(" ")
    .toLowerCase()
    .includes(query.trim().toLowerCase());

/**
 * @param recentSlugs 最近收录的组件。由服务端在构建时算好传入，
 *                    避免服务端与客户端因「当前时间」不同而渲染出不同结果
 */
export const useDirectoryFilter = (recentSlugs: string[]) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DirectoryFilter>("all");

  const entries = useMemo(() => {
    const matchesFilter = ({ component }: DirectoryEntry) => {
      if (filter === "all") return true;
      if (filter === "recent") return recentSlugs.includes(component.slug);
      return component.category === filter;
    };
    return DIRECTORY.filter((entry) => matchesFilter(entry) && matchesQuery(entry, query));
  }, [query, filter, recentSlugs]);

  return { query, setQuery, filter, setFilter, entries };
};
