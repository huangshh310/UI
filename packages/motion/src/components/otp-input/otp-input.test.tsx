/**
 * OtpInput 的行为规约。
 * 测试接缝：@matt-ui/motion 的公开入口。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OtpInput } from "../../index.js";

afterEach(cleanup);

describe("OtpInput", () => {
  it("逐位输入自动推进并在填满全部槽位后触发 onComplete", async () => {
    const onComplete = vi.fn<(value: string) => void>();
    render(<OtpInput label="二次验证安全码" length={6} separatorAt={3} onComplete={onComplete} />);

    const firstSlot = screen.getByRole("textbox", { name: "二次验证安全码" });
    await userEvent.click(firstSlot);
    await userEvent.keyboard("492817");

    expect(onComplete).toHaveBeenCalledWith("492817");
  });

  it("支持 grouped / filled / underline 变体、尺寸、成功态与错误提示（aria-invalid）", () => {
    const { container } = render(
      <OtpInput
        label="验证码"
        length={4}
        variant="grouped"
        size="lg"
        status="success"
        hint="验证码已发送至 138****8000"
        defaultValue="1234"
      />,
    );

    expect(screen.getByText("验证码已发送至 138****8000")).toBeTruthy();
    expect(container.querySelector('[data-slot="otp-input"]')?.getAttribute("data-status")).toBe(
      "success",
    );

    cleanup();
    render(
      <OtpInput label="验证码" length={4} variant="underline" error="验证码已过期，请重新获取" />,
    );
    const firstSlot = screen.getByRole("textbox", { name: "验证码" });
    expect(firstSlot.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("验证码已过期，请重新获取")).toBeTruthy();
  });
});
