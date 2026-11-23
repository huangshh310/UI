"use client";

import { Spinner } from "@matt-ui/ui";

export default function SpinnerVariantsDemo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Spinner variant="ring" size="md" label="环形加载" showLabel />
        <Spinner variant="dots" size="md" label="点阵加载" showLabel />
        <Spinner variant="bars" size="md" label="柱条加载" showLabel />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-5">
        <Spinner variant="dots" size="sm" label="小号点阵" />
        <Spinner variant="dots" size="lg" label="大号点阵" />
        <Spinner variant="bars" size="sm" label="小号柱条" />
        <Spinner variant="bars" size="lg" label="大号柱条" />
      </div>
    </div>
  );
}
