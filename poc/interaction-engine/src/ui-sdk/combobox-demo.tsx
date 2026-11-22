"use client";

/**
 * UI SDK · Combobox 用例：本地过滤、空状态。非受控，通过 onValueChange 观察结果。
 */
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@ui-sdk/react/combobox";
import { useState } from "react";
import { FRUITS } from "@/shared/fruits";

export const ComboboxDemo = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <section>
      <Combobox onValueChange={(next: string | null) => setValue(next)}>
        <ComboboxLabel>Fruit</ComboboxLabel>
        <ComboboxInput placeholder="Search fruits" />
        <ComboboxContent sideOffset={4}>
          <ComboboxEmpty>No fruits found.</ComboboxEmpty>
          <ComboboxList>
            {FRUITS.map(({ value: itemValue, label }) => (
              <ComboboxItem key={itemValue} value={itemValue} label={label}>
                {label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <output data-testid="value">{value ?? "none"}</output>
    </section>
  );
};
