"use client";

import { Skeleton } from "@matt-ui/ui";

export default function SkeletonTableDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl border border-solid border-border bg-card p-4">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3">
          <Skeleton shape="circle" variant="shimmer" className="size-8 shrink-0" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton variant="shimmer" className="h-3.5 w-2/5" />
            <Skeleton variant="shimmer" className="h-3 w-3/4" />
          </div>
          <Skeleton variant="shimmer" className="h-6 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}
