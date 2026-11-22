"use client";

/**
 * Base UI · Combobox 用例：本地过滤、空状态。非受控，通过 onValueChange 观察结果。
 */
import { Combobox } from "@base-ui/react/combobox";
import { useId, useState } from "react";
import { FRUITS, type Fruit } from "@/shared/fruits";

export const ComboboxDemo = () => {
  const id = useId();
  const [value, setValue] = useState<string | null>(null);

  return (
    <section>
      <Combobox.Root
        items={FRUITS}
        onValueChange={(fruit: Fruit | null) => setValue(fruit?.value ?? null)}
      >
        <label htmlFor={id}>Fruit</label>
        <Combobox.Input id={id} placeholder="Search fruits" />
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup>
              <Combobox.Empty>No fruits found.</Combobox.Empty>
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
      <output data-testid="value">{value ?? "none"}</output>
    </section>
  );
};
