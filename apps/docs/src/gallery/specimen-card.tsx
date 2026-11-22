/**
 * 目录中的示例卡片：上方是实时渲染的示例，下方是名称与所属组件。
 *
 * 卡片本身不是链接：舞台里的组件是可交互的，把它们包在链接里既不合法也会抢走点击。
 * 跳转由下方的名称链接承担。
 */
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { CSSProperties } from "react";
import { specimenHref, type DirectoryEntry } from "@/registry/registry";
import { SpecimenStage } from "./specimen-stage";

interface SpecimenCardProps {
  entry: DirectoryEntry;
  /** 在网格中的序号，决定入场动效的先后 */
  index: number;
}

export const SpecimenCard = ({ entry, index }: SpecimenCardProps) => {
  const { specimen, component } = entry;
  const { Demo } = specimen;

  return (
    <article
      data-testid="specimen-card"
      style={{ "--i": index } as CSSProperties}
      className={`rise group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-(--ui-duration-normal) hover:border-foreground/40 md:max-xl:last:col-span-2 ${specimen.wide ? "md:col-span-2" : ""}`}
    >
      <SpecimenStage className="min-h-72 flex-1">
        <Demo />
      </SpecimenStage>
      <footer className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
        <Link
          href={specimenHref(entry)}
          className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
        >
          {specimen.name}
          <ArrowUpRightIcon
            weight="bold"
            className="size-3.5 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
        <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          {component.name}
        </span>
      </footer>
    </article>
  );
};
