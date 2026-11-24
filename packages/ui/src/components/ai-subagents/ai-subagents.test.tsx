import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiSubagents } from "../../index.js";

afterEach(cleanup);

describe("AiSubagents", () => {
  it("渲染默认并行子代理列表与模型标识", () => {
    render(<AiSubagents />);
    expect(screen.getByText(/正在运行 2 个子代理/)).toBeTruthy();
    expect(screen.getByText("追踪会话创建链路")).toBeTruthy();
    expect(screen.getByText("映射令牌刷新流程")).toBeTruthy();
    expect(screen.getByText("排查近期鉴权变更")).toBeTruthy();
    expect(screen.getAllByText("Haiku 4.5").length).toBeGreaterThan(0);
    expect(screen.getByText("Sonnet 4.5")).toBeTruthy();
  });

  it("支持展开单个子代理详情并触发单条停止与全部停止", () => {
    const onStopAgent = vi.fn<(id: string) => void>();
    const onStopAll = vi.fn<() => void>();

    render(<AiSubagents onStopAgent={onStopAgent} onStopAll={onStopAll} />);

    fireEvent.click(screen.getByRole("button", { name: /展开子代理 追踪会话创建链路/ }));
    expect(screen.getByText(/src\/auth\/session\.ts/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "停止子代理 追踪会话创建链路" }));
    expect(onStopAgent).toHaveBeenCalledWith("sub-1");

    fireEvent.click(screen.getByRole("button", { name: "全部停止" }));
    expect(onStopAll).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: "全部停止" })).toBeNull();
  });

  it("支持折叠与展开整个子代理列表", () => {
    render(<AiSubagents />);
    fireEvent.click(screen.getByRole("button", { name: "折叠子代理列表" }));
    expect(screen.queryByText("追踪会话创建链路")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "展开子代理列表" }));
    expect(screen.getByText("追踪会话创建链路")).toBeTruthy();
  });
});
