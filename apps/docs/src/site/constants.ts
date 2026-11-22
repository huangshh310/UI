/**
 * 站点级常量。
 */

export const SITE_NAME = "matt-ui";

export const REPOSITORY_URL = "https://github.com/huangshh310/UI";

/** shadcn GitHub Registry 的地址：GitHub 用户名 / 仓库名 */
export const REGISTRY_ADDRESS = "huangshh310/UI";

/** 站点的公开地址，用于站点地图与 llms.txt。部署时通过环境变量 SITE_URL 指定 */
export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

/** 顶部导航 */
export const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/components", label: "组件" },
  { href: "/docs", label: "文档" },
] as const;

/** 浏览器本地存储中记录主题的键 */
export const THEME_STORAGE_KEY = "matt-ui-theme";

/**
 * 在页面绘制之前恢复用户上次选择的主题，避免先闪一下默认主题。
 * 作为内联脚本放在 <head> 中，内容是固定的常量。
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}})()`;
