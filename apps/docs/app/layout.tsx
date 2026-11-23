/**
 * 根布局：字体、主题、页头与页脚。
 *
 * 主题跟随系统。<head> 中的内联脚本在首次绘制前确定主题（用户选择过则以选择为准），
 * 它会改写 <html> 的 data-theme，所以这里需要 suppressHydrationWarning。
 */
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_NAME, THEME_INIT_SCRIPT } from "@/site/constants";
import { HydrationMarker } from "@/site/hydration-marker";
import { SiteFooter } from "@/site/site-footer";
import { SiteHeader } from "@/site/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} · React 组件库`, template: `%s · ${SITE_NAME}` },
  description: "一套讲究细节的 React 组件：可访问、可主题化、源码可读。",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html
    lang="zh-CN"
    data-theme="light"
    className={`${GeistSans.variable} ${GeistMono.variable}`}
    suppressHydrationWarning
  >
    <head>
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
    </head>
    <body className="flex min-h-dvh flex-col bg-(--site-canvas) font-sans text-foreground antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-(--ui-z-tooltip) focus:rounded-md focus:bg-signal focus:px-3 focus:py-2 focus:text-sm focus:text-signal-foreground"
      >
        跳到主要内容
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <HydrationMarker />
    </body>
  </html>
);

export default RootLayout;
