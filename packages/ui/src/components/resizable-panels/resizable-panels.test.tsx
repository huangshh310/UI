import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { ResizablePanels } from "../../index.js";

beforeAll(() => {
  if (typeof Element !== "undefined" && !Element.prototype.getAnimations) {
    Element.prototype.getAnimations = () => [];
  }
});

afterEach(cleanup);

describe("ResizablePanels", () => {
  it("渲染分栏面板与可聚焦分隔手柄并支持键盘方向键调整比例", async () => {
    const user = userEvent.setup();
    render(
      <ResizablePanels
        panels={[
          { id: "left", defaultSize: 35, minSize: 20, content: <div>左侧目录</div> },
          { id: "right", defaultSize: 65, minSize: 30, content: <div>右侧画布</div> },
        ]}
      />,
    );

    expect(screen.getByText("左侧目录")).toBeTruthy();
    expect(screen.getByText("右侧画布")).toBeTruthy();
    const handle = screen.getByRole("separator");
    expect(handle.getAttribute("aria-orientation")).toBe("vertical");

    const before = handle.getAttribute("aria-valuenow");
    handle.focus();
    await user.keyboard("{ArrowRight}");
    expect(handle.getAttribute("aria-valuenow")).not.toBe(before);
  });

  it("支持垂直分栏与 line / dots 手柄风格", () => {
    const { container } = render(
      <ResizablePanels
        orientation="vertical"
        variant="flush"
        handleStyle="line"
        panels={[
          { id: "top", defaultSize: 60, content: <div>编辑区</div> },
          { id: "bottom", defaultSize: 40, content: <div>终端输出</div> },
        ]}
      />,
    );

    const root = container.firstElementChild;
    expect(root?.getAttribute("data-variant")).toBe("flush");
    expect(root?.getAttribute("data-handle-style")).toBe("line");
    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("horizontal");
  });
});
