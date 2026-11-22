/**
 * 一个主题下的全部按钮：所有变体、尺寸与状态。
 * 浅色与深色各渲染一份，测试与截图都以面板为单位。
 */
import { Button } from "@matt-ui/ui";
import { useState } from "react";
import { TEXT_SIZES, VARIANTS, type Theme } from "./constants";

/** 只含图标的按钮所用的示例图标 */
const SearchIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3 3" strokeLinecap="round" />
  </svg>
);

export const ThemePanel = ({ theme }: { theme: Theme }) => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((previous) => previous + 1);

  return (
    <section data-testid={theme} data-theme={theme} className="panel" aria-label={`${theme} theme`}>
      <h2>{theme}</h2>
      <div className="row">
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant} onClick={increment}>
            {variant}
          </Button>
        ))}
      </div>
      <div className="row">
        {TEXT_SIZES.map((size) => (
          <Button key={size} size={size} onClick={increment}>
            size {size}
          </Button>
        ))}
        <Button size="icon" variant="outline" aria-label="Search" onClick={increment}>
          <SearchIcon />
        </Button>
      </div>
      <div className="row">
        <Button disabled onClick={increment}>
          disabled
        </Button>
        <Button loading onClick={increment}>
          loading
        </Button>
        <Button variant="signal" loading onClick={increment}>
          loading signal
        </Button>
      </div>
      <output data-testid="count">{count}</output>
    </section>
  );
};
