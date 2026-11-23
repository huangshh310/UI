import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../index.js";

afterEach(cleanup);

describe("Card", () => {
  it("组合渲染标题、说明、主体与底部插槽并标记变体", () => {
    render(
      <Card variant="interactive">
        <CardHeader>
          <CardTitle>边缘集群</CardTitle>
          <CardDescription>东京与新加坡多活节点</CardDescription>
          <CardAction>状态</CardAction>
        </CardHeader>
        <CardContent>当前延迟 14ms</CardContent>
        <CardFooter muted>更新于 1 分钟前</CardFooter>
      </Card>,
    );

    const card = screen.getByText("边缘集群").closest('[data-slot="card"]');
    expect(card?.getAttribute("data-variant")).toBe("interactive");
    expect(card?.querySelector('[data-slot="card-action"]')).toBeTruthy();
    expect(screen.getByText("东京与新加坡多活节点")).toBeTruthy();
    expect(screen.getByText("当前延迟 14ms")).toBeTruthy();
    expect(screen.getByText("更新于 1 分钟前")).toBeTruthy();
  });

  it("支持 glass 与 subtle 表面变体", () => {
    const { container } = render(
      <div>
        <Card variant="glass">
          <CardContent>磨砂卡片</CardContent>
        </Card>
        <Card variant="subtle">
          <CardContent>柔和卡片</CardContent>
        </Card>
      </div>,
    );

    const cards = container.querySelectorAll('[data-slot="card"]');
    expect(cards[0]?.getAttribute("data-variant")).toBe("glass");
    expect(cards[1]?.getAttribute("data-variant")).toBe("subtle");
  });
});
