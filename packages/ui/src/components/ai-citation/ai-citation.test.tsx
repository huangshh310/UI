import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiCitation } from "../../index.js";

afterEach(cleanup);

describe("AiCitation", () => {
  it("点击引用编号胶囊切换当前展示的 RAG 上下文片段并触发回调", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(source: { id: string }) => void>();

    render(<AiCitation onSelect={onSelect} />);
    expect(screen.getByText(/一个组件的交互行为只来自一个交互底座/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /WCAG 1\.4\.11/ }));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.getByText(/所有前景与表面对比度不低于 4\.5:1/)).toBeTruthy();
  });

  it("支持 popover 磨砂浮层变体与带外链 URL 的文档来源", () => {
    const { container } = render(
      <AiCitation
        variant="popover"
        sources={[
          {
            id: "doc",
            index: 1,
            title: "Design Token Contrast Guide",
            domain: "w3.org/WCAG22",
            url: "https://www.w3.org/TR/WCAG22/",
            publishedAt: "2026-10",
            snippet: "文本与背景保持 4.5:1 以上对比度。",
          },
        ]}
      />,
    );
    expect(container.querySelector('[data-variant="popover"]')).toBeTruthy();
    const link = screen.getByRole("link", { name: /w3\.org\/WCAG22/ });
    expect(link.getAttribute("href")).toBe("https://www.w3.org/TR/WCAG22/");
  });
});
