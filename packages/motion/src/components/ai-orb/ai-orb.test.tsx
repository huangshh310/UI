import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiOrb } from "../../index.js";

afterEach(cleanup);

describe("AiOrb", () => {
  it("支持 aurora、lattice 与 ring 形态以及胶囊状态标签点击交互", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn<() => void>();

    render(
      <AiOrb
        state="thinking"
        variant="lattice"
        pill
        label="深度思考中"
        badge="o3-mini"
        onClick={onClick}
      />,
    );
    const btn = screen.getByRole("button", { name: /深度思考中/ });
    expect(btn.getAttribute("data-state")).toBe("thinking");
    expect(btn.getAttribute("data-variant")).toBe("lattice");
    expect(screen.getByText("o3-mini")).toBeTruthy();

    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("支持 ring 轨道形态、自定义 tone 与静态 output 语义标签", () => {
    const { container } = render(
      <AiOrb state="speaking" variant="ring" size="lg" tone="emerald" label="语音播报中" />,
    );
    const root = container.querySelector('[data-slot="ai-orb"]');
    expect(root?.getAttribute("data-variant")).toBe("ring");
    expect(root?.getAttribute("data-state")).toBe("speaking");
    expect(screen.getByText("语音播报中")).toBeTruthy();
  });
});
