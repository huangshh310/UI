/**
 * 首页首屏：一句话的主张、进入目录的主操作，以及右侧的实时标本板。
 */
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";
import { COMPONENTS } from "@/registry/registry";
import { REPOSITORY_URL } from "@/site/constants";
import { LinkButton } from "@/site/link-button";
import { HeroSpecimen } from "./hero-specimen";

/** 入场动效的先后顺序 */
const order = (index: number) => ({ "--i": index }) as CSSProperties;

export const HeroSection = () => (
  <section className="grid items-center gap-12 pt-16 pb-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 lg:pt-20">
    <div>
      <h1 className="rise text-5xl leading-[1.08] font-semibold tracking-tight md:text-6xl">
        墨色打底，
        <br />
        只留一个<span className="bg-signal px-2 text-signal-foreground">信号色</span>
      </h1>
      <p
        className="rise mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
        style={order(1)}
      >
        matt-ui 是一套可访问、可主题化的 React 组件库。项目刚起步，目前收录 {COMPONENTS.length}{" "}
        个组件。
      </p>
      <div className="rise mt-9 flex flex-wrap gap-3" style={order(2)}>
        <LinkButton href="/components" tone="signal">
          浏览组件
          <ArrowRightIcon weight="bold" aria-hidden="true" />
        </LinkButton>
        <LinkButton href={REPOSITORY_URL} tone="outline">
          查看源码
        </LinkButton>
      </div>
    </div>
    <HeroSpecimen />
  </section>
);
