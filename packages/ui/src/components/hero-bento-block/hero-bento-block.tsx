"use client";

/**
 * HeroBentoBlock：由 Badge、Button、AvatarStack、SpotlightCard 与 Progress 组合的落地页首屏与 Bento 特性网格区块。
 */
import { cn } from "@matt-ui/utils";
import { BentoGrid, HeroHeader } from "./hero-bento-parts.js";
import type { HeroBentoBlockProps } from "./hero-bento-block.types.js";
import { heroFrameVariants } from "./hero-bento-block.variants.js";

const resolveHeroConfig = (props: HeroBentoBlockProps) => ({
  announcement: props.announcement ?? "新版本上线 · 空间画板 2.0",
  headline: props.headline ?? "让创意从灵感到落地，每一步都轻盈顺手",
  subheadline:
    props.subheadline ?? "专为独立创作者与产品团队打造的极简协作空间，告别繁琐菜单与视觉干扰。",
  variant: props.variant ?? "default",
  align: props.align ?? "start",
  primaryLabel: props.primaryLabel ?? "免费开始",
  secondaryLabel: props.secondaryLabel ?? "了解更多",
  socialProof: props.socialProof ?? "超过 12,000 支团队正在使用",
  compact: props.compact ?? false,
});

export const HeroBentoBlock = (props: HeroBentoBlockProps) => {
  const cfg = resolveHeroConfig(props);

  return (
    <div
      data-slot="hero-bento-block"
      data-variant={cfg.variant}
      data-align={cfg.align}
      className={cn(
        heroFrameVariants({ variant: cfg.variant, compact: cfg.compact }),
        props.className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b to-transparent",
          cfg.variant === "spotlight"
            ? "from-signal/[0.07] dark:from-signal/[0.12]"
            : "from-foreground/[0.03] dark:from-white/[0.04]",
        )}
      />
      <HeroHeader
        announcement={cfg.announcement}
        headline={cfg.headline}
        subheadline={cfg.subheadline}
        variant={cfg.variant}
        align={cfg.align}
        primaryLabel={cfg.primaryLabel}
        secondaryLabel={cfg.secondaryLabel}
        socialProof={cfg.socialProof}
        onPrimaryClick={props.onPrimaryClick}
        onSecondaryClick={props.onSecondaryClick}
      />
      <BentoGrid variant={cfg.variant} compact={cfg.compact} />
    </div>
  );
};
