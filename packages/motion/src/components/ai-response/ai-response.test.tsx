import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiResponse, safeHref } from "../../index.js";

afterEach(cleanup);

describe("safeHref", () => {
  it("允许安全协议与站内相对路径，拦截 XSS 协议与凭据注入", () => {
    expect(safeHref("https://matt-ui.dev/docs")).toBe("https://matt-ui.dev/docs");
    expect(safeHref("mailto:hello@matt-ui.dev")).toBe("mailto:hello@matt-ui.dev");
    expect(safeHref("/components/button")).toBe("/components/button");
    expect(safeHref("#section")).toBe("#section");

    expect(safeHref("javascript:alert(1)")).toBeNull();
    expect(safeHref("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(safeHref("//evil.example/path")).toBeNull();
    expect(safeHref("https://user:pass@evil.example")).toBeNull();
  });
});

describe("AiResponse", () => {
  it("安全渲染 Markdown 标题、代码、表格并剔除危险链接", () => {
    const md = [
      "## 方案建议",
      "推荐使用 **React 19** 与 `Tailwind v4`，参考 [文档](https://matt-ui.dev) 和 [危险](javascript:alert(1))。",
      "```ts",
      "const ok = true;",
      "```",
    ].join("\n");

    render(<AiResponse content={md} model="Matt AI" modelBadge="200K" timestamp="1.2s" />);

    expect(screen.getByText("Matt AI")).toBeTruthy();
    expect(screen.getByText("200K")).toBeTruthy();
    expect(screen.getByText("1.2s")).toBeTruthy();
    expect(screen.getByText("方案建议")).toBeTruthy();
    expect(screen.getByText("const ok = true;")).toBeTruthy();

    const safeLink = screen.getByRole("link", { name: "文档" });
    expect(safeLink.getAttribute("href")).toBe("https://matt-ui.dev/");
    expect(screen.queryByRole("link", { name: "危险" })).toBeNull();
    expect(screen.getByText("危险")).toBeTruthy();
  });

  it("支持展开工具摘要、参考来源，以及触发重新生成与反馈回调", () => {
    const onRegenerate = vi.fn<() => void>();
    const onFeedback = vi.fn<(type: "up" | "down") => void>();

    render(
      <AiResponse
        content="分析完成。"
        variant="ghost"
        tools={[{ id: "t1", name: "search_docs", status: "complete", duration: "0.4s" }]}
        sources={[
          {
            id: "s1",
            title: "设计规范",
            url: "https://matt-ui.dev/spec",
            snippet: "双主题对比度与发丝边框基线",
          },
          { id: "s2", title: "无效协议", url: "javascript:void(0)" },
        ]}
        onRegenerate={onRegenerate}
        onFeedback={onFeedback}
      />,
    );

    expect(document.querySelector('[data-slot="ai-response"]')?.getAttribute("data-variant")).toBe(
      "ghost",
    );

    fireEvent.click(screen.getByRole("button", { name: /已调用 1 项工具/ }));
    expect(screen.getByText("search_docs")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /参考来源（1）/ }));
    expect(screen.getByRole("link", { name: /设计规范/ })).toBeTruthy();
    expect(screen.getByText("双主题对比度与发丝边框基线")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "重新生成" }));
    expect(onRegenerate).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "有帮助" }));
    expect(onFeedback).toHaveBeenCalledWith("up");
  });

  it("在 generating 与 error 状态呈现对应反馈", () => {
    const { rerender } = render(<AiResponse content="" status="generating" />);
    expect(screen.getAllByText("正在构思回复…").length).toBeGreaterThan(0);

    rerender(<AiResponse content="" status="error" errorMessage="模型连接超时" />);
    expect(screen.getByRole("alert").textContent).toContain("模型连接超时");
  });
});
