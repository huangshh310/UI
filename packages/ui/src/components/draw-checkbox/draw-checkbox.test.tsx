/**
 * DrawCheckbox 的行为规约。
 * 测试接缝：@matt-ui/ui 的公开入口。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DrawCheckbox } from "../../index.js";

afterEach(cleanup);

describe("DrawCheckbox", () => {
  it("点击标签或按空格可在未选与已选间切换并回调 onCheckedChange", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(<DrawCheckbox label="同意服务条款" onCheckedChange={onCheckedChange} />);

    const box = screen.getByRole("checkbox", { name: "同意服务条款" });
    expect(box.getAttribute("aria-checked")).toBe("false");

    await userEvent.click(screen.getByText("同意服务条款"));
    expect(box.getAttribute("aria-checked")).toBe("true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);

    box.focus();
    await userEvent.keyboard(" ");
    expect(box.getAttribute("aria-checked")).toBe("false");
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it("受控模式下由外部 checked 决定状态", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(<DrawCheckbox label="订阅周报" checked={false} onCheckedChange={onCheckedChange} />);

    const box = screen.getByRole("checkbox", { name: "订阅周报" });
    await userEvent.click(box);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(box.getAttribute("aria-checked")).toBe("false");
  });

  it("indeterminate 声明 aria-checked=mixed，disabled 时不可切换", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(
      <>
        <DrawCheckbox label="全选" indeterminate />
        <DrawCheckbox label="锁定项" disabled onCheckedChange={onCheckedChange} />
      </>,
    );

    expect(screen.getByRole("checkbox", { name: "全选" }).getAttribute("aria-checked")).toBe(
      "mixed",
    );

    await userEvent.click(screen.getByRole("checkbox", { name: "锁定项" }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
