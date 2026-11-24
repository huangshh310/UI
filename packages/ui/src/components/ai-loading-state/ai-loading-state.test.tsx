import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AiLoadingState } from "../../index.js";

afterEach(cleanup);

describe("AiLoadingState", () => {
  it("渲染 3×3 像素矩阵指示器、动词文案与等宽计时器", () => {
    render(<AiLoadingState pattern="orbit" label="思考中" elapsedSeconds={12.4} />);

    const status = screen.getByRole("status");
    expect(status.getAttribute("data-slot")).toBe("ai-loading-state");
    expect(status.getAttribute("data-pattern")).toBe("orbit");
    expect(status.textContent).toContain("思考中");
    expect(status.textContent).toContain("12.4s");
    expect(status.querySelectorAll('[data-slot="ai-loading-cell"]')).toHaveLength(9);
  });

  it("支持隐藏计时器与胶囊样式变体", () => {
    render(<AiLoadingState pattern="surfer" variant="pill" showElapsed={false} label="检索中" />);

    const status = screen.getByRole("status");
    expect(status.getAttribute("data-variant")).toBe("pill");
    expect(status.textContent).toContain("检索中");
    expect(status.textContent).not.toContain("0.0s");
  });
});
