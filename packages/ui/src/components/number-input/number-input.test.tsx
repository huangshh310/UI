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
});
