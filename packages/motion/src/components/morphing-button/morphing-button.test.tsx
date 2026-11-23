/**
 * MorphingButton 的行为规约。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MorphingButton } from "../../index.js";

afterEach(cleanup);

describe("MorphingButton", () => {
  it("处理中声明 aria-busy 与 aria-disabled 并拦截点击", async () => {
    const onClick = vi.fn<() => void>();
    render(<MorphingButton status="loading" labels={{ loading: "同步中…" }} onClick={onClick} />);

    const button = screen.getByRole("button", { name: "同步中…" });
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.getAttribute("data-status")).toBe("loading");

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("支持 variant、successTone、size、radius 并在非空闲态向播报区同步状态", async () => {
    const onClick = vi.fn<() => void>();
    const { rerender } = render(
      <MorphingButton
        status="idle"
        variant="signal"
        successTone="emerald"
        size="sm"
        radius="default"
        labels={{ idle: "提交", success: "已提交" }}
        onClick={onClick}
      />,
    );

    const idleBtn = screen.getByRole("button", { name: "提交" });
    expect(idleBtn.getAttribute("data-variant")).toBe("signal");
    expect(idleBtn.getAttribute("data-size")).toBe("sm");
    expect(idleBtn.getAttribute("data-radius")).toBe("default");

    await userEvent.click(idleBtn);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <MorphingButton
        status="success"
        variant="signal"
        successTone="emerald"
        size="sm"
        radius="default"
        labels={{ idle: "提交", success: "已提交" }}
        onClick={onClick}
      />,
    );

    expect(screen.getByRole("button", { name: "已提交" }).getAttribute("data-status")).toBe(
      "success",
    );
    expect(screen.getByText("已提交", { selector: "[aria-live='polite']" })).toBeTruthy();
  });
});
