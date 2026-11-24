import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiStackTrace } from "../../index.js";

afterEach(cleanup);

describe("AiStackTrace", () => {
  it("渲染默认命令栏、错误标题、高亮代码片段与 Caused by 链", () => {
    render(<AiStackTrace />);
    expect(screen.getByText(/curl -sf localhost:3000\/api\/users/)).toBeTruthy();
    expect(screen.getByText("exit 22")).toBeTruthy();
    expect(screen.getByText("TypeError")).toBeTruthy();
    expect(screen.getByText("fetch failed")).toBeTruthy();
    expect(screen.getByText("lib/users.ts")).toBeTruthy();
    expect(screen.getAllByText(/ECONNREFUSED/).length).toBeGreaterThan(0);
  });

  it("支持展开折叠框架帧并触发请求修复与复制回调", () => {
    const onAskFix = vi.fn<(payload: { name: string; message: string }) => void>();
    const onCopy = vi.fn<(text: string) => void>();

    render(<AiStackTrace onAskFix={onAskFix} onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: /8 个框架帧/ }));
    expect(screen.getAllByText(/next\/dist\/server\/route-modules/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "请求修复" }));
    expect(onAskFix).toHaveBeenCalledWith({ name: "TypeError", message: "fetch failed" });

    fireEvent.click(screen.getByRole("button", { name: "复制错误堆栈" }));
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it("支持通过命令栏折叠与展开堆栈卡片", () => {
    render(<AiStackTrace />);
    fireEvent.click(screen.getByRole("button", { name: "折叠错误堆栈" }));
    expect(screen.queryByText("fetch failed")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "展开错误堆栈" }));
    expect(screen.getByText("fetch failed")).toBeTruthy();
  });
});
