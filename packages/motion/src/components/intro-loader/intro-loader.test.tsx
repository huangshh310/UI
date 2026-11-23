import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IntroLoader } from "../../index.js";

afterEach(cleanup);

describe("IntroLoader", () => {
  it("展示问候字标并支持点击跳过立即完成", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn<() => void>();

    render(
      <IntroLoader
        active
        fullscreen={false}
        greetings={[
          { text: "你好", lang: "ZH" },
          { text: "Hello", lang: "EN" },
        ]}
        onComplete={onComplete}
      />,
    );

    expect(screen.getByText("你好")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /跳过/ }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("非激活态不渲染遮罩", () => {
    render(<IntroLoader active={false} fullscreen={false} />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("支持 spotlight 变体、subtitle 副标题与 Escape 快捷键跳过", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn<() => void>();

    render(
      <IntroLoader
        active
        fullscreen={false}
        variant="spotlight"
        tone="signal"
        subtitle="Design System · v2.4"
        onComplete={onComplete}
      />,
    );

    const status = screen.getByRole("status", { name: "页面加载中" });
    expect(status.getAttribute("data-variant")).toBe("spotlight");
    expect(screen.getByText("Design System · v2.4")).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
