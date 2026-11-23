import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
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

  it("支持 variant、标签徽标与键盘方向键切换并触发 onTabChange", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn<(id: string) => void>();
    const { container } = render(
      <FolderTabCard
        variant="tinted"
        onTabChange={onTabChange}
        tabs={[
          {
            id: "design",
            label: "设计规范",
            badge: "NEW",
            metric: "98%",
            content: <p>规范内容</p>,
          },
          {
            id: "tokens",
            label: "语义变量",
            badge: "24",
            metric: "24",
            content: <p>变量内容</p>,
          },
        ]}
      />,
    );

    const root = container.querySelector('[data-slot="folder-tab-card"]');
    expect(root?.getAttribute("data-variant")).toBe("tinted");
    expect(screen.getByText("NEW")).toBeTruthy();

    const firstTab = screen.getByRole("tab", { name: /设计规范/ });
    firstTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(onTabChange).toHaveBeenCalledWith("tokens");
    expect(await screen.findByText("变量内容")).toBeTruthy();
  });
});
