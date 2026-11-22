"use client";

import { AiDiffReview } from "@matt-ui/ui";

export default function AiDiffReviewConfigDemo() {
  return (
    <AiDiffReview
      fileName="registry.json"
      lines={[
        { id: "c1", lineNumber: 4, type: "context", content: '  "name": "matt-ui",' },
        { id: "c2", lineNumber: 5, type: "remove", content: '  "totalItems": 71,' },
        { id: "c3", lineNumber: 5, type: "add", content: '  "totalItems": 83,' },
        {
          id: "c4",
          lineNumber: 6,
          type: "add",
          content: '  "categories": ["ai", "blocks", "motion"]',
        },
      ]}
    />
  );
}
