import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Breadcrumb } from "../../index.js";

afterEach(cleanup);

describe("Breadcrumb", () => {
  it("渲染面包屑并在超过 maxItems 时折叠中间层级，点击省略号展开", async () => {
    const user = userEvent.setup();
    render(
      <Breadcrumb
        maxItems={3}
        items={[
          { label: "首页", href: "#home" },
          { label: "组件库", href: "#ui" },
          { label: "导航", href: "#nav" },
          { label: "面包屑" },
        ]}
      />,
    );

    expect(screen.getByRole("navigation", { name: "面包屑导航" })).toBeTruthy();
    expect(screen.queryByText("组件库")).toBeNull();
    expect(screen.getByText("面包屑").getAttribute("aria-current")).toBe("page");

    await user.click(screen.getByRole("button", { name: "展开省略路径" }));
    expect(screen.getByText("组件库")).toBeTruthy();
  });
});
