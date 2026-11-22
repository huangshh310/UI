/**
 * 目录与首页的示例卡片：双层 1px 细边框结构。
 * 外层为干净的抬升卡片，内层为带微点阵的预览舞台，底部常驻组件名、简述与跳转箭头。
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
import { SpecimenStage } from "./specimen-stage";

interface SpecimenCardProps {
  entry: DirectoryEntry;
  /** 在网格中的序号，决定入场动效的先后 */
  index: number;
  /** 是否显示 NEW 标记 */
  isNew: boolean;
  /**
   * 卡片标题展示模式：
   * - specimen（默认，用于目录页）：主标题为示例名，副标题展示所属组件与说明；
   * - component（用于首页精选）：主标题为组件名，副标题展示组件说明。
   */
  titleMode?: "specimen" | "component";
}

interface CardFooterProps {
  href: string;
  title: string;
  subtitle: string;
  isNew: boolean;
  isMotion: boolean;
  heading: "h2" | "h3";
}

const CardFooter = ({ href, title, subtitle, isNew, isMotion, heading }: CardFooterProps) => {
  const Heading = heading;

  return (
    <footer className="flex items-center justify-between gap-3 px-2.5 pt-3 pb-1.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Heading className="truncate text-[15px] font-semibold tracking-tight text-foreground">
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-ring"
            >
              {title}
            </Link>
          </Heading>
          {isNew && <NewBadge />}
          {isMotion && (
            <span className="rounded-full border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
              motion
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <span
        aria-hidden="true"
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border/80 bg-(--site-stage) text-muted-foreground transition-all duration-(--ui-duration-fast) group-hover:border-foreground/25 group-hover:bg-accent group-hover:text-foreground"
      >
        <ArrowUpRightIcon
          weight="bold"
          className="size-3.5 transition-transform duration-(--ui-duration-fast) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </footer>
  );
};

export const SpecimenCard = ({
  entry,
  index,
  isNew,
  titleMode = "specimen",
}: SpecimenCardProps) => {
  const { specimen, component } = entry;
  const { Demo } = specimen;
  const isComponentTitle = titleMode === "component";

  return (
    <article
      data-testid="specimen-card"
      style={{ "--i": index } as CSSProperties}
      className="rise group relative flex min-w-0 flex-col rounded-2xl border border-border bg-(--site-surface) p-2 shadow-xs transition-[border-color,box-shadow] duration-(--ui-duration-normal) hover:border-foreground/25 hover:shadow-md"
    >
      {/* 右上角快捷复制安装命令：悬停/聚焦更清晰，触摸设备上保持可见 */}
      <div className="absolute top-4 right-4 z-20 rounded-full border border-border/80 bg-(--site-surface)/90 opacity-0 shadow-xs backdrop-blur-sm transition-opacity duration-(--ui-duration-fast) group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100">
        <CopyButton text={cliCommand(component)} label={`复制 ${component.name} 的安装命令`} />
      </div>

      <SpecimenStage className="min-h-[260px] flex-1 rounded-xl border border-border/65">
        <Demo />
      </SpecimenStage>

      <CardFooter
        href={specimenHref(entry)}
        title={isComponentTitle ? component.name : specimen.name}
        subtitle={
          isComponentTitle ? component.description : `${component.name} · ${specimen.description}`
        }
        isNew={isNew}
        isMotion={component.dependencies.includes("motion")}
        heading={isComponentTitle ? "h3" : "h2"}
      />
    </article>
  );
};
