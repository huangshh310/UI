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

  it("支持居中对齐、spotlight 变体与自定义按钮及背书文案", async () => {
    const user = userEvent.setup();
    const onPrimary = vi.fn<() => void>();

    const { container } = render(
      <HeroBentoBlock
        variant="spotlight"
        align="center"
        primaryLabel="立即体验"
        secondaryLabel="查看架构文档"
        socialProof="已服务 500+ 工程团队"
        compact
        onPrimaryClick={onPrimary}
      />,
    );

    const root = container.querySelector('[data-slot="hero-bento-block"]');
    expect(root?.getAttribute("data-variant")).toBe("spotlight");
    expect(root?.getAttribute("data-align")).toBe("center");
    expect(screen.getByText("已服务 500+ 工程团队")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "立即体验" }));
    expect(onPrimary).toHaveBeenCalledTimes(1);
  });
});
