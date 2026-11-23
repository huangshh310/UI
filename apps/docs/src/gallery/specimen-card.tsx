/**
 * 目录与首页的极简单体示例卡片：
 * 无边框、无阴影的一体化柔灰画布，静息时只呈现实时交互组件本身；
 * 悬停或键盘聚焦时，右上角复制命令按钮与底部极简标题+外链箭头轻盈浮现。
 *
 * 整张卡片可点击：名称链接通过 ::after 铺满卡片，示例与复制按钮浮在它上面，
 * 因此示例仍可操作，同时避免了「可交互元素嵌套在链接里」的非法结构。
 */
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CopyButton } from "@/detail/copy-button";
import { cliCommand, specimenHref, type DirectoryEntry } from "@/registry/registry";
import { NewBadge } from "./new-badge";

interface SpecimenCardProps {
  entry: DirectoryEntry;
  /** 在网格中的序号，决定入场动效的先后 */
  index: number;
  /** 是否显示 NEW 标记 */
  isNew: boolean;
  /**
   * 卡片标题展示模式：
   * - specimen（默认，用于目录页）：展示示例名；
   * - component（用于首页精选）：展示组件名。
   */
  titleMode?: "specimen" | "component";
  /** 是否占满整行展示（用于页面级 Blocks，避免在三列网格中被挤压） */
  wide?: boolean;
}

interface CardFooterProps {
  href: string;
  title: string;
  isNew: boolean;
  heading: "h2" | "h3";
}

const CardFooter = ({ href, title, isNew, heading }: CardFooterProps) => {
  const Heading = heading;

  return (
    <footer className="flex items-center justify-between gap-3 px-4 pt-0 pb-3.5 opacity-0 transition-opacity duration-(--ui-duration-fast) group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100">
      <div className="flex min-w-0 items-center gap-2">
        <Heading className="truncate text-[15px] font-semibold tracking-tight text-foreground">
          <Link
            href={href}
            className="outline-none after:absolute after:inset-0 after:rounded-[26px] focus-visible:after:outline-2 focus-visible:after:outline-ring"
          >
            {title}
          </Link>
        </Heading>
        {isNew && <NewBadge />}
      </div>
      <ArrowUpRightIcon
        weight="bold"
        aria-hidden="true"
        className="size-4 shrink-0 text-foreground/75 transition-transform duration-(--ui-duration-fast) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
      />
    </footer>
  );
};

export const SpecimenCard = ({
  entry,
  index,
  isNew,
  titleMode = "specimen",
  wide = false,
}: SpecimenCardProps) => {
  const { specimen, component } = entry;
  const { Demo } = specimen;
  const isComponentTitle = titleMode === "component";

  return (
    <article
      data-testid="specimen-card"
      style={{ "--i": Math.min(index, 5) } as CSSProperties}
      className={`rise group relative flex min-w-0 flex-col rounded-[26px] bg-(--site-stage) p-2 transition-colors duration-(--ui-duration-normal) ${
        wide ? "md:col-span-2 xl:col-span-3" : ""
      }`}
    >
      {/* 右上角快捷复制安装命令：静息隐藏，悬停/聚焦/触摸设备可见 */}
      <div className="absolute top-3.5 right-3.5 z-20 rounded-[10px] border border-border/75 bg-(--site-surface)/92 opacity-0 shadow-xs backdrop-blur-md transition-opacity duration-(--ui-duration-fast) group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100">
        <CopyButton text={cliCommand(component)} label={`复制 ${component.name} 的安装命令`} />
      </div>

      {/* 无边框纯透明画布：让真实组件在柔灰一体背景中自然居中漂浮 */}
      <div
        className={`flex flex-1 min-w-0 items-center justify-center ${
          wide ? "min-h-[380px] p-5 sm:p-9" : "min-h-[312px] px-5 pt-7 pb-3"
        }`}
      >
        <div className="relative z-10 flex w-full max-w-full min-w-0 justify-center">
          <Demo />
        </div>
      </div>

      <CardFooter
        href={specimenHref(entry)}
        title={isComponentTitle ? component.name : specimen.name}
        isNew={isNew}
        heading={isComponentTitle ? "h3" : "h2"}
      />
    </article>
  );
};
