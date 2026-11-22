"use client";

/**
 * Tree：遵循 ADR-001，由精确锁版本的 @ui-sdk/react/tree 驱动层级键盘导航与 ARIA 语义。
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
import type { TreeNode, TreeProps } from "./tree.types.js";

const ROW_CLASS = cn(
  "group flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2 font-sans text-[13px] text-foreground outline-none select-none",
  "transition-colors duration-(--ui-duration-fast) hover:bg-accent/70 focus-visible:ring-2 focus-visible:ring-ring",
  "data-[selected]:bg-signal/10 data-[selected]:font-medium data-[selected]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
);

const TreeBranch = ({ nodes }: { nodes: TreeNode[] }) => (
  <>
    {nodes.map((node) => {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      return (
        <TreeItem key={node.id} value={node.id} disabled={node.disabled} className="outline-none">
          <div className={ROW_CLASS}>
            {hasChildren ? (
              <TreeItemIndicator className="inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-transform duration-(--ui-duration-fast) data-[expanded]:rotate-90 motion-reduce:transition-none">
                <ChevronRight aria-hidden="true" className="size-3.5" />
              </TreeItemIndicator>
            ) : (
              <span aria-hidden="true" className="size-4 shrink-0" />
            )}
            <span aria-hidden="true" className="shrink-0 text-muted-foreground">
              {node.icon ??
                (hasChildren ? <Folder className="size-3.5" /> : <FileText className="size-3.5" />)}
            </span>
            <TreeItemLabel className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <span className="truncate">{node.label}</span>
              {node.badge && (
                <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {node.badge}
                </span>
              )}
            </TreeItemLabel>
          </div>
          {hasChildren && (
            <TreeGroup className="ml-3.5 border-l border-solid border-border/75 pl-2">
              <TreeBranch nodes={node.children!} />
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
    className={cn(
      "flex w-full flex-col gap-0.5 rounded-2xl border border-solid border-border bg-card p-2.5 shadow-sm outline-none",
      className,
    )}
  >
    <TreeBranch nodes={nodes} />
  </SdkTree>
);
