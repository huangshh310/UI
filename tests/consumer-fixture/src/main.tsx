/**
 * 使用者项目的入口：像文档里写的那样引入组件与样式表。
 * 本项目没有安装 Tailwind，样式完全来自 @matt-ui/ui/styles.css。
 */
import "@matt-ui/ui/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { THEMES } from "./constants";
import "./fixture.css";
import { ThemePanel } from "./theme-panel";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main>
      <h1>matt-ui consumer fixture</h1>
      {THEMES.map((theme) => (
        <ThemePanel key={theme} theme={theme} />
      ))}
    </main>
  </StrictMode>,
);
