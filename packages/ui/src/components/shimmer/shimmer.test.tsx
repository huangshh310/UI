/**
 * Shimmer 行为规约：验证语义标签切换、静态退化态与多行流式骨架的无障碍状态声明。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Shimmer, ShimmerLines } from "../../index.js";

afterEach(cleanup);

describe("Shimmer", () => {
  it("默认渲染单份可访问文本，不向辅助技术重复暴露微光装饰层", () => {
    render(<Shimmer>正在检索知识库上下文…</Shimmer>);

    const matches = screen.getAllByText("正在检索知识库上下文…");
    const exposed = matches.filter((node) => !node.closest('[aria-hidden="true"]'));
    expect(exposed).toHaveLength(1);
    expect(document.querySelector('[data-slot="shimmer"]')?.getAttribute("data-active")).toBe(
      "true",
    );
  });

  it("支持切换渲染标签并在 active=false 时关闭微光装饰层", () => {
    render(
      <Shimmer as="p" active={false}>
        已完成检索
      </Shimmer>,
    );

    const root = document.querySelector('[data-slot="shimmer"]');
    expect(root?.tagName).toBe("P");
    expect(root?.getAttribute("data-active")).toBe("false");
    expect(root?.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it("ShimmerLines 按指定行数渲染流式段落占位并声明无障碍忙碌状态", () => {
    render(<ShimmerLines lines={4} label="正在组织回答…" />);

    const status = screen.getByRole("status", { name: "正在组织回答…" });
    expect(status.getAttribute("aria-busy")).toBe("true");
    expect(status.querySelectorAll('[data-slot="shimmer-line"]')).toHaveLength(4);
  });
});
