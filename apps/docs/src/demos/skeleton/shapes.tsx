"use client";

import { Skeleton } from "@matt-ui/ui";

export default function SkeletonShapesDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-solid border-border bg-card p-5 shadow-xs">
      <div className="flex items-center gap-3">
        <Skeleton shape="circle" variant="shimmer" className="size-11 shrink-0" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton shape="text" variant="shimmer" className="w-1/2" />
          <Skeleton shape="text" variant="pulse" className="w-4/5" />
        </div>
      </div>
      <Skeleton shape="card" variant="shimmer" />
      <div className="grid grid-cols-2 gap-2.5">
        <Skeleton shape="rounded" variant="pulse" />
        <Skeleton shape="rounded" variant="shimmer" />
      </div>
    </div>
  );
}
