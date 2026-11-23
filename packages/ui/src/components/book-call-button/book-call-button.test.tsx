/**
 * BookCallButton 的行为规约。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BookCallButton } from "../../index.js";

afterEach(cleanup);

describe("BookCallButton", () => {
  it("以 label 作为可访问名称并保留胶囊装饰节点", () => {
    render(<BookCallButton label="预约设计评审" hoverLabel="立即连线" />);
    const button = screen.getByRole("button", { name: "预约设计评审" });
    const capsule = button.querySelector('[data-slot="book-call-capsule"]');

    expect(button.getAttribute("data-slot")).toBe("book-call-button");
    expect(capsule?.getAttribute("aria-hidden")).toBe("true");
  });

  it("支持 variant、tone、size 并响应点击事件", async () => {
    const onClick = vi.fn<() => void>();
    render(
      <BookCallButton
        variant="outline"
        tone="emerald"
        size="sm"
        label="联系顾问"
        onClick={onClick}
      />,
    );
    const button = screen.getByRole("button", { name: "联系顾问" });

    expect(button.getAttribute("data-variant")).toBe("outline");
    expect(button.getAttribute("data-tone")).toBe("emerald");
    expect(button.getAttribute("data-size")).toBe("sm");

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
