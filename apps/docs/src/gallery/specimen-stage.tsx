/**
 * 预览舞台：把示例放在正中的纯色区域。
 */
import type { ReactNode } from "react";

interface SpecimenStageProps {
  children: ReactNode;
  /** 追加的类名，通常用来指定最小高度 */
  className?: string;
}

export const SpecimenStage = ({ children, className = "min-h-64" }: SpecimenStageProps) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    {/* 示例自身浮在整卡链接之上，保持可交互 */}
    <div className="relative z-10">{children}</div>
  </div>
);
