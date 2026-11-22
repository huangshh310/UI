/**
 * POC 应用的根布局。
 * .root 的 isolation: isolate 是 Base UI 官方要求的设置：
 * 它为应用内容建立独立的层叠上下文，保证 Portal 出去的浮层始终盖在页面之上。
 */
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "交互底座 POC",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body>
      <div className="root">{children}</div>
    </body>
  </html>
);

export default RootLayout;
