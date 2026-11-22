import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  Card,
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
        </CardHeader>
        <CardContent>当前延迟 14ms</CardContent>
        <CardFooter muted>更新于 1 分钟前</CardFooter>
      </Card>,
    );

    const card = screen.getByText("边缘集群").closest('[data-slot="card"]');
    expect(card?.getAttribute("data-variant")).toBe("interactive");
    expect(screen.getByText("东京与新加坡多活节点")).toBeTruthy();
    expect(screen.getByText("当前延迟 14ms")).toBeTruthy();
    expect(screen.getByText("更新于 1 分钟前")).toBeTruthy();
  });
});
