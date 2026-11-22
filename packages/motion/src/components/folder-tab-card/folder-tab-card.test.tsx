import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { FolderTabCard } from "../../index.js";

afterEach(cleanup);

describe("FolderTabCard", () => {
  it("点击文件夹标签平滑切换对应面板与统计指标", async () => {
    const user = userEvent.setup();
    render(
      <FolderTabCard
        tabs={[
          {
            id: "ui",
            label: "核心组件",
            metric: "42",
            caption: "零动画依赖",
            content: <p>基础原语内容</p>,
          },
          {
            id: "motion",
            label: "动效组件",
            metric: "16",
            caption: "弹簧物理",
            content: <p>动效组件内容</p>,
          },
        ]}
      />,
    );

    expect(screen.getByText("基础原语内容")).toBeTruthy();
    await user.click(screen.getByRole("tab", { name: "动效组件" }));
    expect(await screen.findByText("动效组件内容")).toBeTruthy();
    expect(screen.getByText("16")).toBeTruthy();
  });
});
