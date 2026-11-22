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
});
