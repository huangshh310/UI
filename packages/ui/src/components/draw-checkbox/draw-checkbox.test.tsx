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

  it("支持 card / pill / tile 变体、圆形外观与扩展插槽", async () => {
    render(
      <DrawCheckbox
        variant="card"
        shape="circle"
        size="lg"
        tone="signal"
        controlPosition="right"
        label="云端自动同步"
        description="实时备份项目快照"
        badge="推荐"
        trailing="￥28/月"
        icon={<span data-testid="card-icon">★</span>}
      />,
    );

    expect(screen.getByTestId("card-icon")).toBeTruthy();
    expect(screen.getByText("推荐")).toBeTruthy();
    expect(screen.getByText("￥28/月")).toBeTruthy();

    const box = screen.getByRole("checkbox", { name: /云端自动同步/ });
    expect(box.getAttribute("data-shape")).toBe("circle");
    expect(box.getAttribute("data-size")).toBe("lg");

    await userEvent.click(screen.getByText("云端自动同步"));
    expect(box.getAttribute("aria-checked")).toBe("true");
  });

  it("支持 strikethrough 待办划线模式并在勾选后标记状态", async () => {
    render(<DrawCheckbox variant="tile" shape="circle" label="完成首页动效打磨" strikethrough />);

    const box = screen.getByRole("checkbox", { name: "完成首页动效打磨" });
    const wrapper = box.closest('[data-slot="draw-checkbox-item"]');
    expect(wrapper?.hasAttribute("data-strikethrough")).toBe(true);

    await userEvent.click(box);
    expect(box.getAttribute("aria-checked")).toBe("true");
  });

  it("传入 error 时声明 aria-invalid 并关联错误提示", () => {
    render(<DrawCheckbox label="我已阅读服务条款" error="请先同意服务条款后再继续" />);

    const box = screen.getByRole("checkbox", { name: "我已阅读服务条款" });
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("请先同意服务条款后再继续");
    expect(box.getAttribute("aria-invalid")).toBe("true");
    expect(box.getAttribute("aria-describedby")).toBe(alert.id);
  });
});
