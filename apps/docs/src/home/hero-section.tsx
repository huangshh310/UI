/**
 * 首页首屏：克制极简的视觉开场——仅保留双行大标题、一句简述与一枚主操作胶囊按钮，
 * 无冗余装饰标签、统计卡片或分隔线，直通下方的实时组件画廊。
 */
import type { CSSProperties } from "react";
import { LinkButton } from "@/site/link-button";

const order = (index: number) => ({ "--i": index }) as CSSProperties;

export const HeroSection = () => (
  <section className="mx-auto flex max-w-3xl flex-col items-center px-5 pt-16 pb-12 text-center md:pt-24 md:pb-16">
    <h1
      style={order(0)}
      className="rise text-[40px] leading-[1.06] font-semibold tracking-[-0.04em] text-foreground sm:text-5xl md:text-[62px]"
    >
      为 C 端与 AI 产品
      <br />
      雕琢每一像素触感
    </h1>

    <p
      style={order(1)}
      className="rise mt-5 max-w-lg text-[15px] leading-relaxed text-balance text-muted-foreground md:text-[17px]"
    >
      开源 React 19 组件平台，融合自然物理触感、无障碍交互与现代 AI 体验，一条命令装入你的项目。
    </p>

    <div style={order(2)} className="rise mt-8">
      <LinkButton href="/components" tone="solid">
        浏览组件
      </LinkButton>
    </div>
  </section>
);
