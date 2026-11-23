import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ReorderList } from "../../index.js";

beforeAll(() => {
  if (typeof Element !== "undefined" && !Element.prototype.getAnimations) {
    Element.prototype.getAnimations = () => [];
  }
});

afterEach(cleanup);

const ITEMS = [
  { id: "a", title: "校验设计 Token", subtitle: "WCAG AA 对比度" },
  { id: "b", title: "生成 Registry", subtitle: "单文件扁平化" },
  { id: "c", title: "执行浏览器 E2E", subtitle: "亮/暗双主题" },
];

describe("ReorderList", () => {
  it("支持键盘 Space 拿起、方向键重排并 Space 放下提交新顺序", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(ids: string[]) => void>();

    render(<ReorderList ariaLabel="构建流水线" items={ITEMS} onValueChange={onValueChange} />);
    const options = screen.getAllByRole("option");
    expect(options[0]?.textContent).toContain("校验设计 Token");

    options[0]?.focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowDown}");
    await user.keyboard(" ");

    expect(onValueChange).toHaveBeenCalledWith(["b", "a", "c"]);
  });

  it("支持 divided 发丝列表变体、compact 密度与序号展示", () => {
    const { container } = render(
      <ReorderList
        ariaLabel="模型回退队列"
        items={ITEMS}
        variant="divided"
        density="compact"
        showIndex
      />,
    );
    const root = container.querySelector('[data-slot="reorder-list"]');
    expect(root?.getAttribute("data-variant")).toBe("divided");
    expect(root?.getAttribute("data-density")).toBe("compact");
    expect(screen.getByText("01")).toBeTruthy();
  });
});
