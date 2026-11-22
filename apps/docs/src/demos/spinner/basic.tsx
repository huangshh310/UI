"use client";

import { Spinner } from "@matt-ui/ui";

export default function SpinnerBasicDemo() {
  return (
    <div className="flex items-center gap-5">
      <Spinner size="xs" label="极小加载器" />
      <Spinner size="sm" label="小号加载器" />
      <Spinner size="md" label="中号加载器" />
      <Spinner size="lg" label="大号加载器" />
    </div>
  );
}
