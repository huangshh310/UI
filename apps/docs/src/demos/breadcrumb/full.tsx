"use client";

import { Breadcrumb } from "@matt-ui/ui";
import { useId } from "react";

export default function BreadcrumbFullDemo() {
  const id = useId();
  return (
    <Breadcrumb
      ariaLabel={`项目层级路径 ${id}`}
      items={[
        { label: "matt-ui", href: "#root" },
        { label: "区块模板", href: "#blocks" },
        { label: "团队成员权限" },
      ]}
    />
  );
}
