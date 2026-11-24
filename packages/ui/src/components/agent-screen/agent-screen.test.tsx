import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AgentScreen } from "../../index.js";

afterEach(cleanup);

describe("AgentScreen", () => {
  it("连接中状态显示极简加载环与连接提示文案", () => {
    render(<AgentScreen status="loading" loadingLabel="正在连接智能体屏幕" />);

    const region = screen.getByRole("region", { name: "智能体屏幕" });
    expect(region.getAttribute("data-slot")).toBe("agent-screen");
    expect(region.getAttribute("data-status")).toBe("loading");
    expect(screen.getByText("正在连接智能体屏幕")).toBeTruthy();
  });

  it("运行中状态渲染实时画面并支持切换状态回调", () => {
    const onStatusChange = vi.fn<(status: "working" | "loading") => void>();
    render(
      <AgentScreen status="working" onStatusChange={onStatusChange}>
        <div>正在浏览产品文档</div>
      </AgentScreen>,
    );

    expect(screen.getByText("正在浏览产品文档")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "连接中" }));
    expect(onStatusChange).toHaveBeenCalledWith("loading");
  });
});
