/**
 * 目录中的示例卡片：大圆角的纯色卡片，中间是实时渲染的示例。
 * 名称与箭头在悬停或聚焦时浮现；没有悬停能力的触摸设备上始终显示。
 *
 * 整张卡片可点击：名称链接的点击区域铺满卡片，示例与复制按钮浮在它上面，
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
}

/** 悬停、聚焦或触摸设备上才显示的元素 */
const REVEAL_CLASSES =
  "opacity-0 transition-all duration-(--ui-duration-normal) group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100";

export const SpecimenCard = ({ entry, index, isNew }: SpecimenCardProps) => {
  const { specimen, component } = entry;
  const { Demo } = specimen;

  return (
    <article
      data-testid="specimen-card"
      style={{ "--i": index } as CSSProperties}
      className={`rise group relative flex flex-col rounded-2xl bg-(--site-tile) p-2.5`}
    >
      <div className={`absolute top-4 right-4 z-10 ${REVEAL_CLASSES}`}>
        <CopyButton text={cliCommand(component)} label={`复制 ${component.name} 的安装命令`} />
      </div>
      <SpecimenStage className="min-h-[300px] flex-1">
        <Demo />
      </SpecimenStage>
      <footer
        className={`flex items-center justify-between gap-3 px-2 pt-2 pb-2 translate-y-1 group-focus-within:translate-y-0 group-hover:translate-y-0 pointer-coarse:translate-y-0 ${REVEAL_CLASSES}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-base font-semibold">
            <Link
              href={specimenHref(entry)}
              className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-ring"
            >
              {specimen.name}
            </Link>
          </h2>
          {isNew && <NewBadge />}
        </div>
        <ArrowUpRightIcon
          weight="bold"
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </footer>
    </article>
  );
};
