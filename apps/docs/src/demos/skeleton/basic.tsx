"use client";

import { Skeleton } from "@matt-ui/ui";

export default function SkeletonBasicDemo() {
  return (
    <div className="flex w-full max-w-xs items-center gap-3.5 rounded-2xl border border-solid border-border bg-card p-4">
      <Skeleton shape="circle" className="size-10 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton variant="shimmer" className="h-3 w-1/2" />
      </div>
    </div>
  );
}
