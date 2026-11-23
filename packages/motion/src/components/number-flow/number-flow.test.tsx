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

  it("支持 size、trend 数据属性与前后缀静态渲染", () => {
    const { container, rerender } = render(
      <NumberFlow value={4890} prefix="¥" suffix="/月" size="xl" trend="up" />,
    );
    const root = container.querySelector('[data-slot="number-flow"]');
    expect(root?.getAttribute("data-size")).toBe("xl");
    expect(root?.getAttribute("data-trend")).toBe("up");
    expect(screen.getByText("¥4,890/月")).toBeTruthy();

    rerender(<NumberFlow value={3120} prefix="¥" suffix="/月" size="sm" trend="down" />);
    expect(root?.getAttribute("data-size")).toBe("sm");
    expect(root?.getAttribute("data-trend")).toBe("down");
    expect(screen.getByText("¥3,120/月")).toBeTruthy();
  });
});
