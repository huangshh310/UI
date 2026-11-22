"use client";

import { Tree, type TreeNode } from "@matt-ui/ui";
import { useState } from "react";

const PERMISSION_TREE: TreeNode[] = [
  {
    id: "workspace",
    label: "工作区治理",
    badge: "RBAC",
    children: [
      { id: "workspace/members", label: "成员与角色分配", badge: "写" },
      { id: "workspace/sso", label: "企业 SSO 凭证", badge: "管" },
    ],
  },
  {
    id: "registry",
    label: "Registry 分发",
    children: [
      { id: "registry/publish", label: "发布新组件版本", badge: "写" },
      { id: "registry/audit", label: "导出对比度报告", badge: "读" },
    ],
  },
];

export default function TreePermissionsDemo() {
  const [selected, setSelected] = useState<string | null>("workspace/members");

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Tree
        ariaLabel="权限策略树"
        nodes={PERMISSION_TREE}
        value={selected}
        onValueChange={setSelected}
      />
      <span className="font-mono text-xs text-muted-foreground">已选策略：{selected}</span>
    </div>
  );
}
