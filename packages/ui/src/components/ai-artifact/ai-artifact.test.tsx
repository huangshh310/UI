import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiArtifact } from "../../index.js";

afterEach(cleanup);

describe("AiArtifact", () => {
  it("支持在实时预览与源码视图之间切换并响应复制回调", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn<(code: string) => void>();

    render(
      <AiArtifact
        title="定价卡片产物"
        code="export const Price = () => <div>¥199</div>;"
        preview={<div>实时渲染的定价预览</div>}
        onCopy={onCopy}
      />,
    );

    expect(screen.getByText("实时渲染的定价预览")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "源码" }));
    expect(screen.getByText(/export const Price/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "复制源码" }));
    expect(onCopy).toHaveBeenCalledWith("export const Price = () => <div>¥199</div>;");
  });

  it("支持多版本胶囊切换并将源码写入系统剪贴板", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(
      <AiArtifact
        title="ReleaseCard.tsx"
        versions={["v1", "v2"]}
        code="export const ReleaseCard = () => null;"
        preview={<div>预览内容</div>}
      />,
    );

    const v2Btn = screen.getByRole("button", { name: "v2" });
    await user.click(v2Btn);
    expect(v2Btn.getAttribute("aria-pressed")).toBe("true");

    await user.click(screen.getByRole("button", { name: "复制源码" }));
    expect(writeText).toHaveBeenCalledWith("export const ReleaseCard = () => null;");
  });
});
