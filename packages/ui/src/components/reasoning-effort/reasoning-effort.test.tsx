import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ReasoningEffortPicker } from "../../index.js";

afterEach(cleanup);

describe("ReasoningEffortPicker", () => {
  it("按受控与非受控模式切换推理深度档位", () => {
    const onValueChange = vi.fn<(value: "low" | "medium" | "high" | "max") => void>();
    render(<ReasoningEffortPicker defaultValue="medium" onValueChange={onValueChange} />);

    const group = screen.getByRole("group", { name: "推理深度" });
    expect(group.getAttribute("data-slot")).toBe("reasoning-effort");
    expect(screen.getByRole("button", { name: /均衡/ }).getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: /极致/ }));
    expect(onValueChange).toHaveBeenCalledWith("max");
    expect(screen.getByRole("button", { name: /极致/ }).getAttribute("aria-pressed")).toBe("true");
  });
});
