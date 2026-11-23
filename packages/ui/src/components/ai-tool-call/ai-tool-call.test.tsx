import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiToolCall } from "../../index.js";

afterEach(cleanup);

describe("AiToolCall", () => {
  it("渲染工具名称与耗时，点击可展开查看入参与返回 JSON", async () => {
    const user = userEvent.setup();
    render(
      <AiToolCall
        toolName="search_registry"
        status="completed"
        durationLabel="128ms"
        summary="检索到 4 个匹配的浮层组件"
        inputJson='{"query":"sheet"}'
        outputJson='{"matches":4}'
      />,
    );

    expect(screen.getByText("search_registry")).toBeTruthy();
    expect(screen.getByText("128ms")).toBeTruthy();
    expect(screen.queryByText('{"query":"sheet"}')).toBeNull();

    await user.click(screen.getByRole("button", { name: /search_registry/ }));
    expect(screen.getByText('{"query":"sheet"}')).toBeTruthy();
    expect(screen.getByText('{"matches":4}')).toBeTruthy();
  });

  it("支持 obsidian 变体、pending 状态、Token 读数以及失败态重试回调", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn<() => void>();
    const { container } = render(
      <AiToolCall
        toolName="deploy_canary"
        variant="obsidian"
        status="error"
        tokensLabel="128 tok"
        defaultExpanded
        onRetry={onRetry}
      />,
    );

    expect(container.querySelector('[data-variant="obsidian"]')).toBeTruthy();
    expect(screen.getByText("128 tok")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "重试工具调用" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
