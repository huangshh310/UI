import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FileManagerBlock } from "../../index.js";

afterEach(cleanup);

describe("FileManagerBlock", () => {
  it("勾选文件行后弹出 SelectionBasket 并支持批量删除与展开上传面板", async () => {
    const user = userEvent.setup();
    render(<FileManagerBlock />);

    expect(screen.getByText("design-tokens.css")).toBeTruthy();
    await user.click(screen.getByRole("checkbox", { name: "选择 design-tokens.css" }));
    expect(screen.getByText("已选 1 项")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "删除" }));
    expect(screen.queryByText("design-tokens.css")).toBeNull();
  });

  it("支持点击目录卡片筛选文件与 onDeleteFiles 回调", async () => {
    const user = userEvent.setup();
    const onDeleteFiles = vi.fn<(ids: string[]) => void>();

    const { container } = render(
      <FileManagerBlock
        variant="elevated"
        basketVariant="inverted"
        onDeleteFiles={onDeleteFiles}
      />,
    );

    expect(
      container.querySelector('[data-slot="file-manager-block"]')?.getAttribute("data-variant"),
    ).toBe("elevated");

    await user.click(screen.getByRole("button", { name: /架构文档/ }));
    expect(screen.getByText("component-roadmap.md")).toBeTruthy();
    expect(screen.queryByText("design-tokens.css")).toBeNull();

    await user.click(screen.getByRole("checkbox", { name: "选择 component-roadmap.md" }));
    await user.click(screen.getByRole("button", { name: "删除" }));
    expect(onDeleteFiles).toHaveBeenCalledWith(["3"]);
    expect(screen.getByText("当前视图下暂无文件资产")).toBeTruthy();
  });
});
