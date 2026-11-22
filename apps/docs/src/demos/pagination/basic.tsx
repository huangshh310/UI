"use client";

import { Pagination } from "@matt-ui/ui";
import { useId, useState } from "react";

export default function PaginationBasicDemo() {
  const id = useId();
  const [page, setPage] = useState(4);

  return (
    <div className="flex flex-col items-center gap-2.5">
      <Pagination
        ariaLabel={`分页示例 ${id}`}
        page={page}
        totalPages={12}
        siblingCount={0}
        onPageChange={setPage}
      />
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        当前第 {page} / 12 页
      </span>
    </div>
  );
}
