/**
 * SpringSelect 的行为规约。
 * 测试接缝：@matt-ui/ui 的公开入口。
 * 真实浏览器下的键盘空窗（Base UI 偏差 #3）、typeahead 与焦点恢复由展示站 E2E 覆盖。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SpringSelect } from "../../index.js";

const OPTIONS = [
  { value: "tokyo", label: "东京", description: "ap-northeast-1" },
  { value: "singapore", label: "新加坡", description: "ap-southeast-1" },
  { value: "frankfurt", label: "法兰克福", disabled: true },
];

afterEach(cleanup);

describe("SpringSelect", () => {
  it("点击触发器展开全部选项，选择后更新显示并回调 onValueChange", async () => {
    const onValueChange = vi.fn<(value: string | null) => void>();
    render(
      <SpringSelect
        label="部署区域"
        placeholder="选择区域"
        options={OPTIONS}
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "部署区域" });
    expect(trigger.textContent).toContain("选择区域");

    await userEvent.click(trigger);
    expect(await screen.findByRole("listbox")).toBeTruthy();

    await userEvent.click(await screen.findByRole("option", { name: /新加坡/ }));
    expect(onValueChange).toHaveBeenCalledWith("singapore");
    expect(trigger.textContent).toContain("新加坡");
  });

  it("受控模式下将 value 重置为 null 后回到占位文本", () => {
    const { rerender } = render(
      <SpringSelect label="部署区域" placeholder="选择区域" options={OPTIONS} value="tokyo" />,
    );
    const trigger = screen.getByRole("combobox", { name: "部署区域" });
    expect(trigger.textContent).toContain("东京");

    rerender(
      <SpringSelect label="部署区域" placeholder="选择区域" options={OPTIONS} value={null} />,
    );
    expect(trigger.textContent).toContain("选择区域");
  });

  it("禁用选项不可选中，disabled 触发器不会打开列表", async () => {
    const onValueChange = vi.fn<(value: string | null) => void>();
    render(<SpringSelect label="部署区域" options={OPTIONS} onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("combobox", { name: "部署区域" }));
    await userEvent.click(await screen.findByRole("option", { name: /法兰克福/ }));
    expect(onValueChange).not.toHaveBeenCalled();

    cleanup();
    render(<SpringSelect label="锁定区域" options={OPTIONS} disabled />);
    await userEvent.click(screen.getByRole("combobox", { name: "锁定区域" }));
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
