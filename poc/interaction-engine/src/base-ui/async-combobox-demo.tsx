"use client";

/**
 * Base UI · 异步 Combobox 用例：远程搜索、加载状态。
 * 关闭内置过滤（filter={null}），列表内容完全由搜索结果决定。
 */
import { Combobox } from "@base-ui/react/combobox";
import { useId } from "react";
import type { Fruit } from "@/shared/fruits";
import { useFruitSearch } from "./use-fruit-search";

export const AsyncComboboxDemo = () => {
  const id = useId();
  const { results, isPending, search } = useFruitSearch();

  return (
    <section>
      <Combobox.Root
        items={results}
        filter={null}
        itemToStringLabel={(fruit: Fruit) => fruit.label}
        isItemEqualToValue={(item: Fruit, selected: Fruit) => item.value === selected.value}
        onInputValueChange={(query, { reason }) => {
          // 选中某一项也会改写输入框，这种变化不需要重新搜索
          if (reason !== "item-press") search(query);
        }}
      >
        <label htmlFor={id}>Async fruit</label>
        <Combobox.Input id={id} placeholder="Search remotely" />
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup aria-busy={isPending || undefined}>
              <Combobox.Status>{isPending ? "Searching…" : null}</Combobox.Status>
              <Combobox.List>
                {(item: Fruit) => (
                  <Combobox.Item key={item.value} value={item}>
                    {item.label}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </section>
  );
};
