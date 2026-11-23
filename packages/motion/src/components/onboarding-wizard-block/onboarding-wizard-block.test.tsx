import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OnboardingWizardBlock } from "../../index.js";

afterEach(cleanup);

describe("OnboardingWizardBlock", () => {
  it("完成三步引导流程后触发 onComplete 回调", async () => {
    const user = userEvent.setup();
    const onComplete =
      vi.fn<(config: { workspace: string; region: string; sso: boolean }) => void>();

    render(<OnboardingWizardBlock onComplete={onComplete} />);
    expect(screen.getByText("工作区基础信息")).toBeTruthy();

    await user.clear(screen.getByLabelText("工作区名称"));
    await user.type(screen.getByLabelText("工作区名称"), "Acme Design");
    await user.click(screen.getByRole("button", { name: "下一步" }));

    expect(screen.getByText("安全与发布策略")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "下一步" }));

    expect(screen.getByText("确认并启动工作区")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "完成初始化" }));

    expect(onComplete).toHaveBeenCalledWith({
      workspace: "Acme Design",
      region: "东京（ap-northeast-1）",
      sso: true,
    });
    expect(screen.getByText("工作区已就绪")).toBeTruthy();
  });

  it("支持 embedded 变体并允许点击已完成步骤直接回跳", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <OnboardingWizardBlock variant="embedded" defaultWorkspace="Design Lab" />,
    );

    const root = container.querySelector('[data-slot="onboarding-wizard-block"]');
    expect(root?.getAttribute("data-variant")).toBe("embedded");

    await user.click(screen.getByRole("button", { name: "下一步" }));
    expect(screen.getByText("安全与发布策略")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /基础信息/ }));
    expect(screen.getByText("工作区基础信息")).toBeTruthy();
  });
});
