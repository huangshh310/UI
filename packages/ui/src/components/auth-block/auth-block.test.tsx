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
    render(<AuthBlock layout="split" brandName="Acme Studio" />);
    expect(screen.getByText("登录 Acme Studio")).toBeTruthy();
    expect(screen.getByText(/统一设计 Token/)).toBeTruthy();
  });
});
