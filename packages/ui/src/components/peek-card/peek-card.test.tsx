import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { PeekCard } from "../../index.js";

afterEach(cleanup);

describe("PeekCard", () => {
  it("悬停链接时展示结构化预览卡片指标与状态", async () => {
    const user = userEvent.setup();
    render(
      <PeekCard
        triggerLabel="ORD-2026-089"
        href="#order"
        delay={0}
        title="ORD-2026-089"
        subtitle="Stripe Checkout"
        value="¥1,290.00"
        identity={{ initials: "林", name: "林知远", meta: "zhiyuan@matt.dev" }}
        metrics={[
          { label: "支付方式", value: "Visa •••• 4242" },
          { label: "手续费", value: "¥19.35" },
        ]}
        footerLeft="2 分钟前"
        status="已结算"
      />,
    );

    expect(screen.queryByText("Visa •••• 4242")).toBeNull();
    await user.hover(screen.getByRole("link", { name: "ORD-2026-089" }));

    expect(await screen.findByText("Visa •••• 4242")).toBeTruthy();
    expect(screen.getByText("林知远")).toBeTruthy();
    expect(screen.getByText("已结算")).toBeTruthy();
  });

  it("支持 size、badge 与 statusTone 扩展属性", () => {
    render(
      <PeekCard
        open
        size="lg"
        badge="MAIN"
        statusTone="success"
        title="matt-ui/ui"
        status="构建通过"
      />,
    );

    const card = screen.getByText("matt-ui/ui").closest('[data-slot="peek-card"]');
    expect(card?.getAttribute("data-size")).toBe("lg");
    expect(screen.getByText("MAIN")).toBeTruthy();
    expect(screen.getByText("构建通过")).toBeTruthy();
  });
});
