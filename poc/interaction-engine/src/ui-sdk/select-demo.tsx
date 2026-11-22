"use client";

/**
 * UI SDK · Select 用例页面的内容：受控的单选，外加一个从外部重置值的按钮。
 */
import { useState } from "react";
import { FruitSelect } from "./fruit-select";

export const SelectDemo = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <main>
      <h1>UI SDK · Select</h1>
      <FruitSelect value={value} onValueChange={setValue} />
      <button type="button" onClick={() => setValue(null)}>
        Reset
      </button>
      <output data-testid="value">{value ?? "none"}</output>
    </main>
  );
};
