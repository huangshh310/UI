"use client";

import { Pagination } from "@matt-ui/ui";
import { useState } from "react";

export default function PaginationVariantsDemo() {
  const [pillPage, setPillPage] = useState(3);
  const [minimalPage, setMinimalPage] = useState(4);

  return (
    <div className="flex flex-col items-center gap-5">
      <Pagination
        variant="pills"
        size="sm"
        showEdges
        page={pillPage}
        totalPages={16}
        onPageChange={setPillPage}
        ariaLabel="胶囊分页导航"
      />
      <Pagination
        variant="minimal"
        size="md"
        page={minimalPage}
        totalPages={12}
        onPageChange={setMinimalPage}
        ariaLabel="极简分页导航"
      />
    </div>
  );
}
