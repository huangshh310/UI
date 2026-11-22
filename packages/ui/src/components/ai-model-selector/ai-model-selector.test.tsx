import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiModelSelector } from "../../index.js";

afterEach(cleanup);

describe("AiModelSelector", () => {
  it("支持切换模型、推理强度与工具能力开关并回调最新配置", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(config: unknown) => void>();

    render(<AiModelSelector onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /Matt Flash/ }));
    expect(onChange).toHaveBeenLastCalledWith({
      modelId: "flash",
      effort: "balanced",
      capabilities: ["web", "sandbox"],
    });

    await user.click(screen.getByRole("button", { name: "深度" }));
    await user.click(screen.getByRole("button", { name: "长期记忆" }));
    expect(onChange).toHaveBeenLastCalledWith({
      modelId: "flash",
      effort: "deep",
      capabilities: ["web", "sandbox", "memory"],
    });
  });
});
