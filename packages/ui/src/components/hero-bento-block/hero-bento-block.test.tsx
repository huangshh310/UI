import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroBentoBlock } from "../../index.js";

afterEach(cleanup);

describe("HeroBentoBlock", () => {
  it("渲染产品首屏与 Bento 特性卡片，并响应主/次 CTA 回调", async () => {
    const user = userEvent.setup();
    const onPrimary = vi.fn<() => void>();
    const onSecondary = vi.fn<() => void>();

    render(<HeroBentoBlock onPrimaryClick={onPrimary} onSecondaryClick={onSecondary} />);
    expect(screen.getByText(/让创意从灵感到落地/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "免费开始" }));
    await user.click(screen.getByRole("button", { name: "了解更多" }));

    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });
});
