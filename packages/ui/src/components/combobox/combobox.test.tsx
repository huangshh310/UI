/**
 * Combobox 的行为规约。
 * 测试接缝：@matt-ui/ui 的公开入口。
 * 真实浏览器下的键盘导航与浮层打开时 Base UI 偏差 #2（aria-hidden-focus）由展示站 E2E 覆盖。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Combobox } from "../../index.js";

const FRAMEWORKS = [
  { value: "next", label: "Next.js", description: "React 全栈框架" },
  { value: "vite", label: "Vite", description: "轻量前端构建器" },
  { value: "astro", label: "Astro", description: "内容优先框架" },
];

afterEach(cleanup);

describe("Combobox", () => {
  it("键入关键字实时过滤选项并高亮命中文本，点击后回填并触发 onValueChange", async () => {
    const onValueChange = vi.fn<(value: string | null) => void>();
    render(
      <Combobox
        label="前端框架"
        placeholder="搜索框架…"
        options={FRAMEWORKS}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("combobox", { name: "前端框架" });
    await userEvent.click(input);
    await userEvent.type(input, "vi");

    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]?.querySelector("mark")?.textContent?.toLowerCase()).toBe("vi");

    await userEvent.click(options[0]!);
    expect(onValueChange).toHaveBeenCalledWith("vite");
    expect((input as HTMLInputElement).value).toBe("Vite");
  });

  it("没有匹配项时展示 emptyText", async () => {
    render(<Combobox label="前端框架" options={FRAMEWORKS} emptyText="未找到匹配框架" />);

    const input = screen.getByRole("combobox", { name: "前端框架" });
    await userEvent.click(input);
    await userEvent.type(input, "zzz");

    expect(await screen.findByText("未找到匹配框架")).toBeTruthy();
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("点击清除按钮清空当前选中值并通知 null", async () => {
    const onValueChange = vi.fn<(value: string | null) => void>();
    render(
      <Combobox
        label="前端框架"
        options={FRAMEWORKS}
        defaultValue="next"
        onValueChange={onValueChange}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "清除选项" }));
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect((screen.getByRole("combobox", { name: "前端框架" }) as HTMLInputElement).value).toBe("");
  });
});
