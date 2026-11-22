/**
 * 命令面板的开关状态：按钮点击与全局快捷键 Cmd/Ctrl+K 共用同一个状态。
 */
import { useEffect, useState } from "react";

export const useCommandPalette = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    // 标记快捷键已经可用。页面在服务端渲染后要等脚本加载完才会响应按键，
    // 这个标记让自动化测试知道从何时起按键不会丢失
    document.documentElement.dataset.shortcutsReady = "";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      delete document.documentElement.dataset.shortcutsReady;
    };
  }, []);

  return { open, setOpen };
};
