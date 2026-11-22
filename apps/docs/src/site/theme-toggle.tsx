"use client";

/**
 * 主题切换按钮：在深色与浅色之间切换，并记住用户的选择。
 *
 * 当前主题记录在 <html data-theme> 上，按钮本身不保存状态；
 * 图标由 CSS 的 dark: 变体决定显示哪一个，因此服务端与客户端渲染结果一致。
 */
import { Button } from "@matt-ui/ui";
import { MoonIcon, SunIcon } from "@phosphor-icons/react/dist/ssr";
import { THEME_STORAGE_KEY } from "./constants";

const toggleTheme = () => {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // 本地存储不可用时只影响「记住选择」，切换本身已经生效
  }
};

export const ThemeToggle = () => (
  <Button
    variant="ghost"
    size="icon"
    aria-label="切换主题"
    className="rounded-full"
    onClick={toggleTheme}
  >
    <SunIcon weight="bold" className="hidden dark:block" aria-hidden="true" />
    <MoonIcon weight="bold" className="dark:hidden" aria-hidden="true" />
  </Button>
);
