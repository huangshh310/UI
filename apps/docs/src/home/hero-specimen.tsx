/**
 * 首页右侧的标本板：把几个真实运行的示例拼成一张带标注的样张。
 */
import type { ReactNode } from "react";
import { ButtonLoading } from "@/demos/button/loading";
import { ButtonSignal } from "@/demos/button/signal";
import { ButtonVariants } from "@/demos/button/variants";

/** 样张中的一格：左上角是等宽字体的标注，中间是示例 */
const Cell = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={`stage relative flex min-h-48 items-center justify-center p-8 ${className}`}>
    <span className="absolute top-3 left-4 font-mono text-xs tracking-wide text-muted-foreground uppercase">
      {label}
    </span>
    {children}
  </div>
);

export const HeroSpecimen = () => (
  <div
    className="rise grid overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-2"
    style={{ "--i": 2 } as React.CSSProperties}
  >
    <Cell label="variant" className="border-b border-border sm:col-span-2">
      <ButtonVariants />
    </Cell>
    <Cell label="signal" className="border-b border-border sm:border-r sm:border-b-0">
      <ButtonSignal />
    </Cell>
    <Cell label="loading">
      <ButtonLoading />
    </Cell>
  </div>
);
