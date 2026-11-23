"use client";

import { Breadcrumb } from "@matt-ui/ui";
import { Folder, Home } from "lucide-react";

const ITEMS = [
  { label: "工作区", href: "#workspace", icon: <Home className="size-3.5" /> },
  { label: "设计系统", href: "#design", icon: <Folder className="size-3.5" /> },
  { label: "导航原语" },
];

export default function BreadcrumbVariantsDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Breadcrumb variant="slash" ariaLabel="斜杠面包屑" items={ITEMS} />
      <Breadcrumb variant="pill" size="sm" ariaLabel="胶囊面包屑" items={ITEMS} />
    </div>
  );
}
