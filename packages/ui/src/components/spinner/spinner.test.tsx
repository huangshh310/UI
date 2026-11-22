import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Spinner } from "../../index.js";

afterEach(cleanup);

describe("Spinner", () => {
  it("以语义 status 节点渲染并暴露无障碍标签", () => {
    render(<Spinner size="lg" label="正在同步组件" />);
    const el = screen.getByRole("status", { name: "正在同步组件" });
    expect(el.getAttribute("data-size")).toBe("lg");
  });
});
