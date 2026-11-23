import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Spinner } from "../../index.js";

afterEach(cleanup);

describe("Spinner", () => {
  it("以语义 status 节点渲染并暴露无障碍标签", () => {
    render(<Spinner size="lg" label="正在同步组件" />);
    const el = screen.getByRole("status", { name: "正在同步组件" });
    expect(el.getAttribute("data-size")).toBe("lg");
    expect(el.getAttribute("data-variant")).toBe("ring");
  });

  it("支持 dots 与 bars 视觉形态及可见 label 文本", () => {
    render(
      <div>
        <Spinner variant="dots" size="sm" label="连接节点中" showLabel />
        <Spinner variant="bars" size="md" label="流式生成中" />
      </div>,
    );

    const dots = screen.getByRole("status", { name: "连接节点中" });
    expect(dots.getAttribute("data-variant")).toBe("dots");
    expect(screen.getByText("连接节点中")).toBeTruthy();

    const bars = screen.getByRole("status", { name: "流式生成中" });
    expect(bars.getAttribute("data-variant")).toBe("bars");
  });
});
