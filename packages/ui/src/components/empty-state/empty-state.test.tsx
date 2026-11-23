import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { EmptyState } from "../../index.js";

afterEach(cleanup);

describe("EmptyState", () => {
  it("渲染空态标题、说明与主次操作按钮", () => {
    render(
      <EmptyState
        title="还没有创建任何项目"
        description="从模板快速初始化，或导入现有仓库。"
        action={<button type="button">新建项目</button>}
        secondaryAction={<button type="button">查看文档</button>}
      />,
    );

    expect(screen.getByText("还没有创建任何项目")).toBeTruthy();
    expect(screen.getByRole("button", { name: "新建项目" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "查看文档" })).toBeTruthy();
  });

  it("支持 default / card / dashed / compact 四种视觉形态与自定义插画", () => {
    const { container } = render(
      <div>
        <EmptyState variant="card" title="卡片空态" />
        <EmptyState variant="dashed" title="虚线空态" />
        <EmptyState compact title="紧凑空态" />
        <EmptyState
          variant="default"
          title="插画空态"
          illustration={<svg data-testid="custom-art" />}
        />
      </div>,
    );

    const items = container.querySelectorAll('[data-slot="empty-state"]');
    expect(items[0]?.getAttribute("data-variant")).toBe("card");
    expect(items[1]?.getAttribute("data-variant")).toBe("dashed");
    expect(items[2]?.getAttribute("data-variant")).toBe("compact");
    expect(items[3]?.getAttribute("data-variant")).toBe("default");
    expect(screen.getByTestId("custom-art")).toBeTruthy();
  });
});
