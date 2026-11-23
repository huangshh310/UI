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

  it("支持 variant、size 与 radius 变体属性", () => {
    render(
      <LockInput label="搜索" variant="filled" size="lg" radius="full" ringTone="neutral" mono />,
    );

    const root = screen.getByLabelText("搜索").closest('[data-slot="lock-input"]');
    expect(root?.getAttribute("data-variant")).toBe("filled");
    expect(root?.getAttribute("data-size")).toBe("lg");
  });

  it("lockable 模式下支持点击按钮切换锁定与可编辑态", async () => {
    const onLockedChange = vi.fn<(locked: boolean) => void>();
    render(
      <LockInput
        label="生产域名"
        defaultValue="api.matt.dev"
        lockable
        defaultLocked
        onLockedChange={onLockedChange}
      />,
    );

    const input = screen.getByLabelText("生产域名") as HTMLInputElement;
    const toggle = screen.getByRole("button", { name: "解锁编辑" });
    expect(input.readOnly).toBe(true);
    expect(toggle.getAttribute("aria-pressed")).toBe("true");

    await userEvent.click(toggle);
    expect(onLockedChange).toHaveBeenCalledWith(false);
    expect(input.readOnly).toBe(false);
    expect(screen.getByRole("button", { name: "锁定为只读" }).getAttribute("aria-pressed")).toBe(
      "false",
    );

    await userEvent.type(input, "/v2");
    expect(input.value).toBe("api.matt.dev/v2");
  });

  it("clearable 在存在内容且可编辑时显示清空按钮并触发回调", async () => {
    const onClear = vi.fn<() => void>();
    render(<LockInput label="项目名称" defaultValue="matt-ui" clearable onClear={onClear} />);

    const input = screen.getByLabelText("项目名称") as HTMLInputElement;
    const clearButton = screen.getByRole("button", { name: "清空输入" });
    await userEvent.click(clearButton);

    expect(input.value).toBe("");
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(input);
    expect(screen.queryByRole("button", { name: "清空输入" })).toBeNull();
  });

  it("copyable 支持一键复制当前内容并回调 onCopy", async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    const onCopy = vi.fn<(value: string) => void>();

    render(<LockInput label="密钥" defaultValue="sk_live_001" locked copyable onCopy={onCopy} />);

    await userEvent.click(screen.getByRole("button", { name: "复制内容" }));
    expect(writeText).toHaveBeenCalledWith("sk_live_001");
    expect(onCopy).toHaveBeenCalledWith("sk_live_001");
  });

  it("revealable 在密码输入框中切换明文与密文展示", async () => {
    render(<LockInput label="访问令牌" type="password" defaultValue="secret" revealable />);

    const input = screen.getByLabelText("访问令牌") as HTMLInputElement;
    expect(input.type).toBe("password");

    await userEvent.click(screen.getByRole("button", { name: "显示内容" }));
    expect(input.type).toBe("text");

    await userEvent.click(screen.getByRole("button", { name: "隐藏内容" }));
    expect(input.type).toBe("password");
  });

  it("showCount、shortcut 与 labelExtra 按预期展示并实时更新计数", async () => {
    render(
      <LockInput
        label="短链标识"
        labelExtra={<span>必填</span>}
        shortcut="⌘K"
        maxLength={20}
        showCount
      />,
    );

    expect(screen.getByText("必填")).toBeTruthy();
    expect(screen.getByText("⌘K")).toBeTruthy();
    expect(screen.getByText("0 / 20")).toBeTruthy();

    await userEvent.type(screen.getByLabelText("短链标识"), "hello");
    expect(screen.getByText("5 / 20")).toBeTruthy();
  });
});
