"use client";

/**
 * UI SDK · Reorder 用例：一个可用鼠标、触摸和键盘重排的列表。
 */
import { useState } from "react";
import { SortableItem, SortableList } from "./sortable-list-parts";

const LABELS: Record<string, string> = {
  alpha: "Alpha",
  beta: "Beta",
  gamma: "Gamma",
  delta: "Delta",
};

export const ReorderDemo = () => {
  const [order, setOrder] = useState(Object.keys(LABELS));

  return (
    <main>
      <h1>UI SDK · Reorder</h1>
      <p id="reorder-help" className="sr-only">
        Press Space to pick up an item, arrow keys to move it, Space to drop, Escape to cancel.
      </p>
      <SortableList aria-label="Priorities" value={order} onValueChange={setOrder}>
        {({ order: visibleOrder }) =>
          visibleOrder.map((key) => (
            <SortableItem key={key} value={key} aria-describedby="reorder-help">
              {LABELS[key]}
            </SortableItem>
          ))
        }
      </SortableList>
      <output data-testid="order">{order.join(",")}</output>
    </main>
  );
};
