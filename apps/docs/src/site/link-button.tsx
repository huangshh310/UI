/**
 * 外观为胶囊按钮的链接，用于跳转到另一个页面的主操作或次要操作。
 *
 * Button 渲染的是 <button>，语义上不适合做页面跳转；
 * 组件库目前还没有提供「以链接形式渲染」的能力，所以站点先自己实现。
 */
import Link from "next/link";
import type { ReactNode } from "react";

interface LinkButtonProps {
  href: string;
  /** solid 用于页面上唯一的主操作，outline 用于次要操作 */
  tone: "solid" | "outline";
  children: ReactNode;
}

const TONE_CLASSES: Record<LinkButtonProps["tone"], string> = {
  solid: "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/88",
  outline:
    "border-border bg-(--site-surface) text-foreground shadow-xs hover:border-foreground/30 hover:bg-accent",
};

export const LinkButton = ({ href, tone, children }: LinkButtonProps) => (
  <Link
    href={href}
    className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border px-6 text-sm font-medium whitespace-nowrap outline-none transition-all duration-(--ui-duration-fast) ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-4 ${TONE_CLASSES[tone]}`}
  >
    {children}
  </Link>
);
