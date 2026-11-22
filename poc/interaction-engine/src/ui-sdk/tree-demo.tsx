"use client";

/**
 * UI SDK · Tree 用例：一个带分支的文件树，单选。
 * Base UI 没有对应组件，这个用例只用来评估 UI SDK 能否填补缺口。
 */
import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@ui-sdk/react/tree";
import { useState } from "react";

/** 树节点；带 children 的是分支 */
interface FileNode {
  value: string;
  label: string;
  children?: FileNode[];
}

const FILES: FileNode[] = [
  {
    value: "src",
    label: "src",
    children: [
      { value: "src/index.ts", label: "index.ts" },
      { value: "src/utils.ts", label: "utils.ts" },
    ],
  },
  { value: "package.json", label: "package.json" },
  { value: "README.md", label: "README.md" },
];

/** 递归渲染节点；分支的子节点放在 TreeGroup 中 */
const FileItems = ({ nodes }: { nodes: FileNode[] }) =>
  nodes.map(({ value, label, children }) => (
    <TreeItem key={value} value={value}>
      <TreeItemLabel>{label}</TreeItemLabel>
      {children && (
        <TreeGroup>
          <FileItems nodes={children} />
        </TreeGroup>
      )}
    </TreeItem>
  ));

export const TreeDemo = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <main>
      <h1>UI SDK · Tree</h1>
      <Tree
        aria-label="Files"
        value={value}
        onValueChange={(next: string | null) => setValue(next)}
      >
        <FileItems nodes={FILES} />
      </Tree>
      <output data-testid="value">{value ?? "none"}</output>
    </main>
  );
};
