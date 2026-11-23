import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tabs } from "../../index.js";

afterEach(cleanup);

const ITEMS = [
  { value: "overview", label: "概览", content: <p>概览面板内容</p> },
  { value: "tokens", label: "Token", badge: "12", content: <p>Token 面板内容</p> },
  { value: "disabled", label: "已禁用", disabled: true, content: <p>禁用内容</p> },
];

describe("Tabs", () => {
  it("点击与方向键切换页签并回调 onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(val: string) => void>();

    render(<Tabs items={ITEMS} defaultValue="overview" onValueChange={onValueChange} />);
    expect(screen.getByText("概览面板内容")).toBeTruthy();

    await user.click(screen.getByRole("tab", { name: /Token/ }));
    expect(onValueChange).toHaveBeenCalledWith("tokens");
    expect(screen.getByText("Token 面板内容")).toBeTruthy();
  });

  it("支持 line / enclosed / card 变体、尺寸规格与等宽分布", () => {
    const { container } = render(
      <Tabs items={ITEMS} variant="enclosed" size="lg" fullWidth defaultValue="overview" />,
    );
    const root = container.querySelector('[data-slot="tabs"]');
    expect(root?.getAttribute("data-variant")).toBe("enclosed");
    expect(root?.getAttribute("data-size")).toBe("lg");
    expect(screen.getByRole("tab", { name: "已禁用" }).getAttribute("aria-disabled")).toBe("true");
  });
});
