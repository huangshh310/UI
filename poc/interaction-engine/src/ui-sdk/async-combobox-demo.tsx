"use client";

/**
 * UI SDK · 异步 Combobox 用例：远程搜索、加载状态。
 *
 * 防抖、取消被替换的请求、丢弃过期结果都由官方的 useAsyncOptions 负责，
 * 不需要像 Base UI 版那样自己管理 AbortController。
 */
import { useAsyncOptions } from "@ui-sdk/react/async-options";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxStatus,
} from "@ui-sdk/react/combobox";
import { searchFruits, type Fruit } from "@/shared/fruits";

export const AsyncComboboxDemo = () => {
  const fruits = useAsyncOptions(
    (query: string, { signal }: { signal: AbortSignal }) => searchFruits(query, signal),
    { debounce: 100 },
  );

  return (
    <section>
      <Combobox
        items={fruits.items}
        filter={false}
        status={fruits.status}
        onQueryChange={(query: string) => fruits.setQuery(query)}
      >
        <ComboboxLabel>Async fruit</ComboboxLabel>
        <ComboboxInput placeholder="Search remotely" />
        <ComboboxContent sideOffset={4}>
          <ComboboxStatus>{(state) => (state.loading ? "Searching…" : null)}</ComboboxStatus>
          <ComboboxList>
            {(state) =>
              (state.items as Fruit[]).map(({ value, label }) => (
                <ComboboxItem key={value} value={value} label={label}>
                  {label}
                </ComboboxItem>
              ))
            }
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </section>
  );
};
