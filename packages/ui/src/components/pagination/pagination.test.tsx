import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Pagination } from "../../index.js";

afterEach(cleanup);

describe("Pagination", () => {
  it("渲染页码与省略号，点击页码或上一页/下一页触发回调", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn<(page: number) => void>();

    render(<Pagination page={5} totalPages={12} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "第 5 页" }).getAttribute("aria-current")).toBe(
      "page",
    );

    await user.click(screen.getByRole("button", { name: "下一页" }));
    expect(onPageChange).toHaveBeenCalledWith(6);

    await user.click(screen.getByRole("button", { name: "第 1 页" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("支持 pills / minimal 变体与首尾页快捷跳转", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn<(page: number) => void>();

    const { container } = render(
      <Pagination
        page={3}
        totalPages={10}
        variant="minimal"
        size="sm"
        showEdges
        onPageChange={onPageChange}
      />,
    );

    const nav = container.querySelector('[data-slot="pagination"]');
    expect(nav?.getAttribute("data-variant")).toBe("minimal");
    expect(nav?.getAttribute("data-size")).toBe("sm");

    await user.click(screen.getByRole("button", { name: "最后一页" }));
    expect(onPageChange).toHaveBeenCalledWith(10);
  });
});
