import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SelectionBasket } from "../../index.js";

afterEach(cleanup);

describe("SelectionBasket", () => {
  it("已选数量大于 0 时展示动作栏并触发批量操作与清空", async () => {
    const user = userEvent.setup();
    const onArchive = vi.fn<() => void>();
    const onClear = vi.fn<() => void>();

    render(
      <SelectionBasket
        count={3}
        totalCount={12}
        floating={false}
        actions={[{ id: "archive", label: "归档", onClick: onArchive }]}
        onClear={onClear}
      />,
    );

    expect(screen.getByText("已选 3 项")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "归档" }));
    expect(onArchive).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "清空" }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("已选数量为 0 时不渲染动作栏", () => {
    render(
      <SelectionBasket
        count={0}
        floating={false}
        actions={[{ id: "archive", label: "归档", onClick: vi.fn<() => void>() }]}
        onClear={vi.fn<() => void>()}
      />,
    );

    expect(screen.queryByRole("button", { name: "归档" })).toBeNull();
  });

  it("支持 inverted 反色浮舱、sm 尺寸与禁用按钮态", () => {
    render(
      <SelectionBasket
        count={2}
        variant="inverted"
        size="sm"
        floating={false}
        actions={[{ id: "export", label: "导出", disabled: true, onClick: vi.fn<() => void>() }]}
        onClear={vi.fn<() => void>()}
      />,
    );

    const toolbar = screen.getByRole("toolbar", { name: "批量操作栏" });
    expect(toolbar.getAttribute("data-variant")).toBe("inverted");
    expect((screen.getByRole("button", { name: "导出" }) as HTMLButtonElement).disabled).toBe(true);
  });
});
