import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NumberInput } from "../../index.js";

afterEach(cleanup);

describe("NumberInput", () => {
  it("点击加减步进按钮按步长更新数值并遵守上下界", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(val: number | null) => void>();

    render(
      <NumberInput
        label="并发数"
        defaultValue={4}
        min={1}
        max={6}
        step={2}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "并发数" }) as HTMLInputElement;
    expect(input.value).toBe("4");

    await user.click(screen.getByRole("button", { name: "增加" }));
    expect(onValueChange).toHaveBeenCalledWith(6);
    expect(input.value).toBe("6");

    await user.click(screen.getByRole("button", { name: "减少" }));
    expect(onValueChange).toHaveBeenCalledWith(4);
  });

  it("支持 stepper 变体、前后缀单位与错误校验态", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(val: number | null) => void>();

    render(
      <NumberInput
        label="超时阈值"
        variant="stepper"
        size="sm"
        defaultValue={300}
        step={50}
        prefix=">"
        suffix="ms"
        error="阈值不能低于 500ms"
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "超时阈值" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toBe("阈值不能低于 500ms");
    expect(screen.getByText("ms")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "增加" }));
    expect(onValueChange).toHaveBeenCalledWith(350);
  });
});
