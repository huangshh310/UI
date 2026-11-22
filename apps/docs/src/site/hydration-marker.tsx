"use client";

/**
 * 水合标记：页面的脚本加载完成、事件处理器接好之后，在 <html> 上加 data-hydrated。
 *
 * 服务端渲染的页面在水合之前看得见但点不动。自动化测试据此判断从何时起可以操作，
 * 否则在较慢的机器上，过早的点击与按键会丢失。
 */
import { useEffect } from "react";

export const HydrationMarker = () => {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "";
  }, []);

  return null;
};
