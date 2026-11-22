/**
 * 外观为胶囊按钮的链接，用于跳转到另一个页面的主操作。
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
  solid: "bg-primary text-primary-foreground hover:bg-primary/88",
  outline: "border-input text-foreground hover:bg-accent",
};

export const LinkButton = ({ href, tone, children }: LinkButtonProps) => (
  <Link
    href={href}
    className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border border-transparent px-6 text-sm font-medium whitespace-nowrap transition-colors duration-(--ui-duration-fast) ease-out active:scale-[0.97] [&_svg]:size-4 ${TONE_CLASSES[tone]}`}
  >
    {children}
  </Link>
);
