import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AiImageReveal } from "../../index.js";

afterEach(cleanup);

describe("AiImageReveal", () => {
  it("未传入图片地址时处于极光等待态并展示提示词与动态状态胶囊", () => {
    const { container } = render(
      <AiImageReveal
        alt="暮色山湖"
        prompt="暮色下的平静高山湖泊，柔和雾霭"
        generatingLabel="正在构思光影…"
      />,
    );

    const root = container.querySelector('[data-slot="ai-image-reveal"]');
    expect(root?.getAttribute("aria-busy")).toBe("true");
    expect(root?.getAttribute("data-variant")).toBe("default");
    expect(screen.getAllByText("正在构思光影…").length).toBeGreaterThan(0);
    expect(screen.getByText("暮色下的平静高山湖泊，柔和雾霭")).toBeTruthy();
    expect(container.querySelector('[data-slot="ai-image-reveal-aurora"]')).toBeTruthy();
  });

  it("generating=true 时保持等待态并支持 framed/glass 变体与左上角 badge", () => {
    const { container, rerender } = render(
      <AiImageReveal
        src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        alt="极光"
        variant="framed"
        radius="xl"
        badge="1024×1024 · Imagen"
        generating
      />,
    );

    expect(container.querySelector("canvas")).toBeTruthy();
    expect(container.querySelector('[data-phase="idle"]')).toBeTruthy();
    expect(container.querySelector('[data-variant="framed"]')).toBeTruthy();
    expect(screen.getByText("1024×1024 · Imagen")).toBeTruthy();

    rerender(
      <AiImageReveal
        src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        alt="极光"
        variant="glass"
        radius="md"
        badge="16:9 · Studio"
        generating
      />,
    );

    expect(container.querySelector('[data-variant="glass"]')).toBeTruthy();
    expect(screen.getByText("16:9 · Studio")).toBeTruthy();
  });
});
