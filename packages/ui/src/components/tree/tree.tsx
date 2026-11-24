"use client";

/**
 * Tree：遵循 ADR-001，由精确锁版本的 @ui-sdk/react/tree 驱动层级键盘导航与 ARIA 语义，
 * 支持 card / ghost 外观、compact / comfortable 密度与可切换缩进参考线。
 */
import {
  Tree as SdkTree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
} from "@ui-sdk/react/tree";
import { cn } from "@matt-ui/utils";
import { ChevronRight, FileText, Folder } from "lucide-react";
import type { TreeDensity, TreeNode, TreeProps } from "./tree.types.js";
import { treeGroupVariants, treeRootVariants, treeRowVariants } from "./tree.variants.js";

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
