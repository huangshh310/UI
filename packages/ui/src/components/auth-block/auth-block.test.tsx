import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthBlock } from "../../index.js";

afterEach(cleanup);

describe("AuthBlock", () => {
  it("填写邮箱与密码提交登录表单并支持切换注册模式", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(payload: { mode: string; email: string; password: string }) => void>();

    render(<AuthBlock onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("工作邮箱"), "ada@matt.dev");
    await user.type(screen.getByLabelText("密码"), "secret-123");
    await user.click(screen.getByRole("button", { name: "立即登录" }));

    expect(onSubmit).toHaveBeenCalledWith({
      mode: "login",
      email: "ada@matt.dev",
      password: "secret-123",
    });

    await user.click(screen.getByRole("button", { name: "注册新账号" }));
    expect(screen.getByRole("button", { name: "创建工作区账号" })).toBeTruthy();
  });

  it("支持 split 双栏品牌布局变体", () => {
    render(<AuthBlock layout="split" brandName="Acme Studio" variant="elevated" />);
    expect(screen.getByText("登录 Acme Studio")).toBeTruthy();
    expect(screen.getByText(/统一设计 Token/)).toBeTruthy();
  });

  it("支持多 SSO 提供方、忘记密码回调与错误提示横幅", async () => {
    const user = userEvent.setup();
    const onSsoClick = vi.fn<(providerId?: string) => void>();
    const onForgotPassword = vi.fn<() => void>();

    render(
      <AuthBlock
        showForgotPassword
        error="邮箱或密码不正确，请重试。"
        ssoProviders={[
          { id: "github", label: "GitHub" },
          { id: "passkey", label: "Passkey" },
        ]}
        onSsoClick={onSsoClick}
        onForgotPassword={onForgotPassword}
      />,
    );

    expect(screen.getByRole("alert").textContent).toContain("邮箱或密码不正确");
    await user.click(screen.getByRole("button", { name: "Passkey" }));
    expect(onSsoClick).toHaveBeenCalledWith("passkey");

    await user.click(screen.getByRole("button", { name: "忘记密码？" }));
    expect(onForgotPassword).toHaveBeenCalledTimes(1);
  });
});
