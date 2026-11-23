import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AiImageReveal } from "../../index.js";

afterEach(cleanup);

describe("AiImageReveal", () => {
  it("未传入图片地址时处于粒子等待态并展示提示词与状态胶囊", () => {
    const { container } = render(
      <AiImageReveal
        alt="暮色山湖"
        prompt="暮色下的平静高山湖泊，柔和雾霭"
        generatingLabel="绘制粒子中…"
      />,
    );

    const root = container.querySelector('[data-slot="ai-image-reveal"]');
    expect(root?.getAttribute("aria-busy")).toBe("true");
    expect(screen.getAllByText("绘制粒子中…").length).toBeGreaterThan(0);
    expect(screen.getByText("暮色下的平静高山湖泊，柔和雾霭")).toBeTruthy();
  });

  it("generating=true 时保持等待态并渲染画布", () => {
    const { container } = render(
      <AiImageReveal src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="极光" generating />,
    );

    expect(container.querySelector("canvas")).toBeTruthy();
    expect(container.querySelector('[data-phase="idle"]')).toBeTruthy();
  });
});
