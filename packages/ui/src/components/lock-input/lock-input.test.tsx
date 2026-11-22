/**
 * LockInput 的行为规约。
 * 测试接缝：@matt-ui/ui 的公开入口。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LockInput } from "../../index.js";

afterEach(cleanup);

describe("LockInput", () => {
  it("通过 label 关联输入框并支持输入与回调", async () => {
    const onChange = vi.fn<() => void>();
    render(<LockInput label="工作邮箱" placeholder="you@studio.dev" onChange={onChange} />);

    const input = screen.getByLabelText("工作邮箱");
    await userEvent.type(input, "hi");

    expect((input as HTMLInputElement).value).toBe("hi");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("传入 error 时标记 aria-invalid 并关联错误提示", () => {
    render(<LockInput label="邮箱" hint="仅用于通知" error="邮箱格式不正确" />);

    const input = screen.getByLabelText("邮箱");
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("邮箱格式不正确");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(alert.id);
  });

  it("locked 为真时设为只读并标记 data-locked", async () => {
    render(<LockInput label="项目 ID" defaultValue="prj_01" locked />);

    const input = screen.getByLabelText("项目 ID") as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(input.closest('[data-slot="lock-input"]')?.hasAttribute("data-locked")).toBe(true);

    await userEvent.type(input, "99");
    expect(input.value).toBe("prj_01");
  });

  it("无错误时将 hint 通过 aria-describedby 关联到输入框", () => {
    render(<LockInput label="API Key" hint="聚焦时自动锁定焦点环" />);

    const input = screen.getByLabelText("API Key");
    const hint = screen.getByText("聚焦时自动锁定焦点环");
    expect(input.getAttribute("aria-describedby")).toBe(hint.id);
    expect(input.getAttribute("aria-invalid")).toBeNull();
  });
});
