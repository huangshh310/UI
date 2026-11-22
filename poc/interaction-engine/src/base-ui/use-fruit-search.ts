/**
 * Base UI 版异步搜索的状态逻辑。
 *
 * Base UI 不提供异步选项的辅助工具，取消上一次请求、丢弃过期结果都需要自己实现。
 * 写法取自 Base UI 官方「Async search」示例并做了精简。
 */
import { useRef, useState, useTransition } from "react";
import { searchFruits, type Fruit } from "@/shared/fruits";

interface FruitSearch {
  results: Fruit[];
  isPending: boolean;
  /** 输入变化时调用；空字符串清空结果 */
  search: (query: string) => void;
}

export const useFruitSearch = (): FruitSearch => {
  const [results, setResults] = useState<Fruit[]>([]);
  const [isPending, startTransition] = useTransition();
  const controllerRef = useRef<AbortController | null>(null);

  const search = (query: string) => {
    // 新的输入到来时，先取消仍在进行的上一次请求
    controllerRef.current?.abort();
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    startTransition(async () => {
      const found = await searchFruits(query, controller.signal).catch(() => null);
      // 请求被取消时 found 为 null；即使拿到结果，也要确认它没有过期
      if (found === null || controller.signal.aborted) return;
      startTransition(() => setResults(found));
    });
  };

  return { results, isPending, search };
};
