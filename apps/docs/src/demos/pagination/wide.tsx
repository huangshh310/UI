"use client";

import { Pagination } from "@matt-ui/ui";
import { useId, useState } from "react";

export default function PaginationWideDemo() {
  const id = useId();
  const [page, setPage] = useState(6);

  return (
    <div className="flex flex-col items-center gap-2.5">
      <Pagination
        ariaLabel={`宽表分页示例 ${id}`}
        page={page}
        totalPages={24}
        siblingCount={1}
        onPageChange={setPage}
      />
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        显示第 {(page - 1) * 20 + 1}–{page * 20} 条，共 480 条记录
      </span>
    </div>
  );
}
