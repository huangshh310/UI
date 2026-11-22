"use client";

/**
 * Dialog 用例页面的公共外壳，两套实现共用。
 *
 * 除了放置对话框与气泡卡片，还提供两样测试辅助：
 * - 一个背景按钮及其点击计数，用于验证模态对话框打开时背景不可交互；
 * - 一段很高的占位内容，用于验证滚动锁定。
 */
import { useState, type ReactNode } from "react";

interface DialogPageShellProps {
  title: string;
  children: ReactNode;
}

export const DialogPageShell = ({ title, children }: DialogPageShellProps) => {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>{title}</h1>
      {children}
      <button type="button" data-testid="outside-action" onClick={() => setCount(count + 1)}>
        Outside action
      </button>
      <output data-testid="outside-count">{count}</output>
      <div className="tall" />
    </main>
  );
};
