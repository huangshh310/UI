/**
 * 预览舞台：带点阵底纹的区域，把示例放在正中。
 */
import type { ReactNode } from "react";

interface SpecimenStageProps {
  children: ReactNode;
  /** 追加的类名，通常用来指定最小高度 */
  className?: string;
}

export const SpecimenStage = ({ children, className = "min-h-64" }: SpecimenStageProps) => (
  <div className={`stage flex items-center justify-center p-8 ${className}`}>{children}</div>
);
