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
  { value: "next", label: "Next.js", description: "React 全栈框架", badge: "v16" },
  { value: "vite", label: "Vite", description: "轻量前端构建器", badge: "v7" },
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

  it("支持 multiple 多选模式：可连续勾选生成可移除芯片，并支持移除单个芯片", async () => {
    const onValueChange = vi.fn<(value: string[]) => void>();
    render(
      <Combobox
        multiple
        label="项目标签"
        placeholder="搜索并添加框架…"
        options={FRAMEWORKS}
        defaultValue={["next"]}
        onValueChange={onValueChange}
      />,
    );

    expect(screen.getByRole("button", { name: "移除 Next.js" })).toBeTruthy();

    const input = screen.getByRole("combobox", { name: "项目标签" });
    await userEvent.click(input);
    await userEvent.click(await screen.findByRole("option", { name: /Vite/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["next", "vite"]);

    await userEvent.keyboard("{Escape}");
    await userEvent.click(screen.getByRole("button", { name: "移除 Next.js" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["vite"]);
  });

  it("支持变体、提示文案与错误校验态（aria-invalid）", () => {
    render(
      <Combobox
        label="目标框架"
        variant="filled"
        size="lg"
        error="请选择至少一个构建框架"
        options={FRAMEWORKS}
      />,
    );

    const input = screen.getByRole("combobox", { name: "目标框架" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("请选择至少一个构建框架")).toBeTruthy();
  });
});
