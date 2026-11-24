import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Accordion } from "../../index.js";

afterEach(cleanup);

const ITEMS = [
  { value: "q1", title: "如何安装组件？", content: "通过 Registry CLI 或 npm 包按需引入。" },
  { value: "q2", title: "是否支持深色主题？", content: "在任意祖先节点添加 .dark 类即可切换。" },
];

describe("Accordion", () => {
  it("点击触发项展开折叠面板并支持默认展开", async () => {
    const user = userEvent.setup();
    render(<Accordion items={ITEMS} defaultValue={["q1"]} />);

    const q1 = screen.getByRole("button", { name: "如何安装组件？" });
    expect(q1.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("通过 Registry CLI 或 npm 包按需引入。")).toBeTruthy();

    const q2 = screen.getByRole("button", { name: "是否支持深色主题？" });
    await user.click(q2);
    expect(q2.getAttribute("aria-expanded")).toBe("true");
    expect(q1.getAttribute("aria-expanded")).toBe("false");
  });

  it("支持 separated 独立分卡、plus 指示器与多开模式", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordion
        items={ITEMS}
        variant="separated"
        indicator="plus"
        multiple
        defaultValue={["q1"]}
      />,
    );
    const root = container.querySelector('[data-slot="accordion"]');
    expect(root?.getAttribute("data-variant")).toBe("separated");
    expect(root?.getAttribute("data-indicator")).toBe("plus");

    await user.click(screen.getByRole("button", { name: "是否支持深色主题？" }));
    expect(
      screen.getByRole("button", { name: "如何安装组件？" }).getAttribute("aria-expanded"),
    ).toBe("true");
    expect(
      screen.getByRole("button", { name: "是否支持深色主题？" }).getAttribute("aria-expanded"),
    ).toBe("true");
  });
});
