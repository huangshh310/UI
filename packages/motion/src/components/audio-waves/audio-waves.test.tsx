import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AudioWaves } from "../../index.js";

afterEach(cleanup);

describe("AudioWaves", () => {
  it("渲染语音波形条并支持点击切换聆听与暂停状态", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn<(active: boolean) => void>();

    render(<AudioWaves defaultActive onActiveChange={onActiveChange} />);
    expect(screen.getByText("正在聆听语音…")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "暂停语音输入" }));
    expect(onActiveChange).toHaveBeenCalledWith(false);
    expect(screen.getByText("语音已暂停")).toBeTruthy();
  });

  it("支持 variant='bars' 形态及可选实时转写字幕与语种徽章", () => {
    const { container } = render(
      <AudioWaves variant="bars" locale="中文" transcript="帮我生成一份高对比度双主题设计系统。" />,
    );

    expect(container.querySelector('[data-variant="bars"]')).toBeTruthy();
    expect(screen.getByText("中文")).toBeTruthy();
    expect(screen.getByText(/帮我生成一份高对比度双主题设计系统。/)).toBeTruthy();
  });

  it("支持 dots 波形、obsidian 色调与 compact 胶囊模式", () => {
    const { container } = render(
      <AudioWaves
        variant="dots"
        tone="obsidian"
        compact
        label="实时口述"
        transcript="紧凑模式隐藏此行"
      />,
    );
    const root = container.querySelector('[data-slot="audio-waves"]');
    expect(root?.getAttribute("data-variant")).toBe("dots");
    expect(root?.getAttribute("data-tone")).toBe("obsidian");
    expect(screen.getByText("实时口述")).toBeTruthy();
    expect(screen.queryByText(/紧凑模式隐藏此行/)).toBeNull();
  });
});
