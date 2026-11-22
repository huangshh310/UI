/**
 * 预览舞台：带细微点阵背景的居中展示区，让交互组件从画面中清晰浮现。
 */
import type { ReactNode } from "react";

interface SpecimenStageProps {
  children: ReactNode;
  /** 追加的类名，通常用来指定最小高度或圆角边框 */
  className?: string;
}

export const SpecimenStage = ({ children, className = "min-h-64" }: SpecimenStageProps) => (
  <div
    className={`stage-grid flex min-w-0 items-center justify-center bg-(--site-stage) p-6 sm:p-8 ${className}`}
  >
    {/* 示例自身浮在整卡链接之上，保持可交互；宽度不超过舞台，内容过宽时由示例自己滚动 */}
    <div className="relative z-10 flex w-full max-w-full min-w-0 justify-center">{children}</div>
  </div>
);
