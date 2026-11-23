/**
 * StretchSwitch 的行为规约。
 * 测试接缝：@matt-ui/motion 的公开入口。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StretchSwitch } from "../../index.js";

afterEach(cleanup);

describe("StretchSwitch", () => {
  it("点击标签或开关可切换开启状态并触发 onCheckedChange", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(
      <StretchSwitch
        label="合并后自动部署预览"
        description="开启后每次提交自动构建预览链接"
        onCheckedChange={onCheckedChange}
      />,
    );

    const sw = screen.getByRole("switch", { name: /合并后自动部署预览/ });
    expect(sw.getAttribute("aria-checked")).toBe("false");

    await userEvent.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(sw.getAttribute("aria-checked")).toBe("true");
  });

  it("支持 card / pill / row 变体、尺寸、色调、图标、徽章与滑块内图标", async () => {
    const { container } = render(
      <StretchSwitch
        variant="card"
        size="lg"
        tone="success"
        label="实时同步"
        description="保存后自动推送到边缘节点"
        badge="推荐"
        icon={<span data-testid="switch-icon">✦</span>}
        thumbIcon={{
          checked: <span data-testid="thumb-on">✓</span>,
          unchecked: <span data-testid="thumb-off">○</span>,
        }}
        defaultChecked
      />,
    );

    expect(screen.getByText("推荐")).toBeTruthy();
    expect(screen.getByTestId("switch-icon")).toBeTruthy();
    expect(screen.getByTestId("thumb-on")).toBeTruthy();
    expect(container.querySelector('[data-slot="stretch-switch-thumb"]')).toBeTruthy();

    await userEvent.click(screen.getByRole("switch", { name: /实时同步/ }));
    expect(screen.getByTestId("thumb-off")).toBeTruthy();
  });

  it("禁用态不可切换", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(
      <StretchSwitch
        label="组织强制策略"
        disabled
        defaultChecked
        onCheckedChange={onCheckedChange}
      />,
    );

    const sw = screen.getByRole("switch", { name: /组织强制策略/ });
    await userEvent.click(sw);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(sw.getAttribute("aria-checked")).toBe("true");
  });
});
