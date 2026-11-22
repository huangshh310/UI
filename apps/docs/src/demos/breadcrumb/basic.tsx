"use client";

import { Breadcrumb } from "@matt-ui/ui";
import { useId } from "react";

export default function BreadcrumbBasicDemo() {
  const id = useId();

  return (
    <div className="flex flex-col items-start gap-3">
      <Breadcrumb
        ariaLabel={`折叠路径 ${id}`}
        maxItems={3}
        items={[
          { label: "工作区", href: "#workspace" },
          { label: "设计系统", href: "#design" },
          { label: "导航组件", href: "#navigation" },
          { label: "面包屑" },
        ]}
      />
      <Breadcrumb
        ariaLabel={`完整路径 ${id}`}
        items={[
          { label: "matt-ui", href: "#root" },
          { label: "packages", href: "#packages" },
          { label: "ui" },
        ]}
      />
    </div>
  );
}
