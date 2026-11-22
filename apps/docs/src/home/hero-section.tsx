/**
 * 首页首屏：居中的大标题、一句说明与进入目录的主操作。
 */
import type { CSSProperties } from "react";
import { COMPONENTS, DIRECTORY } from "@/registry/registry";
import { LinkButton } from "@/site/link-button";

/** 入场动效的先后顺序 */
const order = (index: number) => ({ "--i": index }) as CSSProperties;

export const HeroSection = () => (
  <section className="mx-auto flex max-w-4xl flex-col items-center pt-14 pb-12 text-center lg:pt-20">
    <h1 className="rise text-[40px] leading-[1.04] font-medium tracking-[-0.035em] md:text-[72px]">
      墨色打底，
      <br />
      只留一个<span className="rounded-xl bg-signal px-3 text-signal-foreground">信号色</span>
    </h1>
    <p
      className="rise mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground"
      style={order(1)}
    >
      开源的 React 组件库。实时预览、完整的 TypeScript 源码，通过 shadcn Registry 直接装进你的项目。
      目前收录 {COMPONENTS.length} 个组件、{DIRECTORY.length} 个示例。
    </p>
    <div className="rise mt-8" style={order(2)}>
      <LinkButton href="/components" tone="solid">
        浏览组件
      </LinkButton>
    </div>
  </section>
);
