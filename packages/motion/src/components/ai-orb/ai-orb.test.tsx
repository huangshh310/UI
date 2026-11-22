import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiOrb } from "../../index.js";

afterEach(cleanup);

describe("AiOrb", () => {
  it("支持 aurora 与 lattice 两种形态以及胶囊状态标签点击交互", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn<() => void>();

    render(<AiOrb state="thinking" variant="lattice" pill label="深度思考中" onClick={onClick} />);
    const btn = screen.getByRole("button", { name: /深度思考中/ });
    expect(btn.getAttribute("data-state")).toBe("thinking");

    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
