// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Tree：遵循 ADR-001，由精确锁版本的 @ui-sdk/react/tree 驱动层级键盘导航与 ARIA 语义，
 * 支持 card / ghost 外观、compact / comfortable 密度与可切换缩进参考线。
 */

import { cn } from "@/lib/utils";
import {
  Tree as SdkTree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
} from "@ui-sdk/react/tree";
import { cva } from "class-variance-authority";
import { ChevronRight, FileText, Folder } from "lucide-react";
import { type ReactNode } from "react";

export const treeRootVariants = cva("flex w-full flex-col gap-0.5 outline-none", {
  variants: {
    variant: {
      card: "rounded-2xl border border-solid border-border/80 bg-card p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-white/12",
      ghost: "rounded-xl bg-transparent p-1",
    },
  },
  defaultVariants: {
    variant: "card",
  },
});

export const treeRowVariants = cva(
  "group flex cursor-pointer items-center gap-1.5 rounded-lg px-2 font-sans text-foreground transition-colors duration-(--ui-duration-fast) outline-none select-none hover:bg-accent/70 focus-visible:ring-2 focus-visible:ring-ring data-[selected]:bg-signal/10 data-[selected]:font-medium data-[selected]:text-foreground data-[selected]:ring-1 data-[selected]:ring-signal/25 data-[disabled]:pointer-events-none data-[disabled]:opacity-45 dark:data-[selected]:bg-signal/18 dark:data-[selected]:ring-signal/35",
  {
    variants: {
      density: {
        compact: "h-7 text-xs",
        comfortable: "h-8 text-[13px]",
      },
    },
    defaultVariants: {
      density: "comfortable",
    },
  },
);

export const treeGroupVariants = cva("ml-3.5 pl-2", {
  variants: {
    showGuides: {
      true: "border-l border-solid border-border/75 dark:border-white/12",
      false: "",
    },
  },
  defaultVariants: {
    showGuides: true,
  },
});
export type TreeVariant = "card" | "ghost";

export type TreeDensity = "compact" | "comfortable";

export interface TreeNode {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  disabled?: boolean;
  children?: TreeNode[];
}

export interface TreeProps {
  /** 树形层级数据 */
  nodes: TreeNode[];
  /** 受控选中节点 id */
  value?: string | null;
  /** 初始选中节点 id */
  defaultValue?: string | null;
  /** 选中节点变化回调 */
  onValueChange?: (value: string | null) => void;
  /** 默认展开的分支 id 列表 */
  defaultExpanded?: string[];
  /** 容器外观：卡片容器或无边框侧栏模式 */
  variant?: TreeVariant;
  /** 行高密度 */
  density?: TreeDensity;
  /** 是否显示层级缩进参考线 */
  showGuides?: boolean;
  /** 树控件无障碍名称 */
  ariaLabel?: string;
  /** 自定义容器类名 */
  className?: string;
}
const TreeBranch = ({
  nodes,
  density,
  showGuides,
}: {
  nodes: TreeNode[];
  density: TreeDensity;
  showGuides: boolean;
}) => (
  <>
    {nodes.map((node) => {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      return (
        <TreeItem key={node.id} value={node.id} disabled={node.disabled} className="outline-none">
          <TreeItemLabel data-slot="tree-row" className={treeRowVariants({ density })}>
            {hasChildren ? (
              <TreeItemIndicator className="inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-transform duration-(--ui-duration-fast) group-hover:text-foreground data-[expanded]:rotate-90 motion-reduce:transition-none">
                <ChevronRight aria-hidden="true" className="size-3.5" />
              </TreeItemIndicator>
            ) : (
              <span aria-hidden="true" className="size-4 shrink-0" />
            )}
            <span
              aria-hidden="true"
              className="inline-flex shrink-0 items-center text-muted-foreground group-data-[selected]:text-signal"
            >
              {node.icon ??
                (hasChildren ? <Folder className="size-3.5" /> : <FileText className="size-3.5" />)}
            </span>
            <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <span className="truncate">{node.label}</span>
              {node.badge && (
                <span className="shrink-0 rounded-md bg-secondary/85 px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground dark:bg-white/[0.08]">
                  {node.badge}
                </span>
              )}
            </span>
          </TreeItemLabel>
          {hasChildren && (
            <TreeGroup className={treeGroupVariants({ showGuides })}>
              <TreeBranch nodes={node.children!} density={density} showGuides={showGuides} />
            </TreeGroup>
          )}
        </TreeItem>
      );
    })}
  </>
);

export const Tree = ({
  nodes,
  value,
  defaultValue,
  onValueChange,
  defaultExpanded,
  variant = "card",
  density = "comfortable",
  showGuides = true,
  ariaLabel = "树形视图",
  className,
}: TreeProps) => (
  <SdkTree
    aria-label={ariaLabel}
    value={value}
    defaultValue={defaultValue}
    defaultExpanded={defaultExpanded}
    onValueChange={(next: string | null) => onValueChange?.(next)}
    data-slot="tree"
    data-variant={variant}
    data-density={density}
    className={cn(treeRootVariants({ variant }), className)}
  >
    <TreeBranch nodes={nodes} density={density} showGuides={showGuides} />
  </SdkTree>
);
