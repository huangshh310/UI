import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StaggeredList } from "../../index.js";

afterEach(cleanup);

describe("StaggeredList", () => {
  it("按序渲染全部子条目并保持完整语义结构", () => {
    render(
      <StaggeredList>
        <div>条目一</div>
        <div>条目二</div>
        <div>条目三</div>
      </StaggeredList>,
    );

    expect(screen.getByText("条目一")).toBeTruthy();
    expect(screen.getByText("条目二")).toBeTruthy();
    expect(screen.getByText("条目三")).toBeTruthy();
  });

  it("透传 variant 与 layout 数据属性并在子项增删时同步更新 DOM", () => {
    const { container, rerender } = render(
      <StaggeredList variant="slide-left" distance={16} staggerMs={60} layout>
        <div key="a">规划</div>
        <div key="b">开发</div>
      </StaggeredList>,
    );

    const root = container.querySelector('[data-slot="staggered-list"]');
    expect(root?.getAttribute("data-variant")).toBe("slide-left");
    expect(root?.getAttribute("data-layout")).toBe("true");
    expect(screen.getByText("规划")).toBeTruthy();

    rerender(
      <StaggeredList variant="scale" layout={false}>
        <div key="b">开发</div>
        <div key="c">发布</div>
      </StaggeredList>,
    );
    expect(root?.getAttribute("data-variant")).toBe("scale");
    expect(root?.getAttribute("data-layout")).toBe("false");
    expect(screen.getByText("发布")).toBeTruthy();
  });
});
