import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { NumberFlow } from "../../index.js";

afterEach(cleanup);

describe("NumberFlow", () => {
  it("按 Intl.NumberFormat 格式化数值并在更新时保持无障碍读数准确", () => {
    const { rerender } = render(
      <NumberFlow
        value={1280}
        format={{ style: "currency", currency: "CNY", maximumFractionDigits: 0 }}
      />,
    );
    expect(screen.getByText(/1,280/)).toBeTruthy();

    rerender(
      <NumberFlow
        value={2560}
        format={{ style: "currency", currency: "CNY", maximumFractionDigits: 0 }}
      />,
    );
    expect(screen.getByText(/2,560/)).toBeTruthy();
  });
});
