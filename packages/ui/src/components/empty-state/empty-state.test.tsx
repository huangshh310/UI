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
});
