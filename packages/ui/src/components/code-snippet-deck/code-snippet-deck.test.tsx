/**
 * CodeSnippetDeck 的行为规约：切换语言、编辑参数、预设快捷值、重置参数、换行切换与复制。
 * 测试接缝：@matt-ui/ui 的公开入口。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeSnippetDeck } from "../../index.js";

afterEach(cleanup);

const SNIPPETS = [
  { language: "curl", label: "cURL", code: "curl {{baseUrl}}/users?limit={{limit}}" },
  {
    language: "python",
    label: "Python",
    code: 'requests.get("{{baseUrl}}/users", params={"limit": {{limit}}})',
  },
];
const PARAMETERS = [
  { name: "baseUrl", label: "Base URL", defaultValue: "https://api.example.com" },
  { name: "limit", label: "Limit", defaultValue: "20", options: ["10", "20", "50"] },
];

/** 当前显示的代码 */
const code = () => screen.getByTestId("snippet-code").textContent;

describe("CodeSnippetDeck", () => {
  it("默认显示第一种语言，参数已代入默认值", () => {
    render(<CodeSnippetDeck snippets={SNIPPETS} parameters={PARAMETERS} />);

    expect(code()).toBe("curl https://api.example.com/users?limit=20");
  });

  it("切换语言页签后显示该语言的代码并触发 onLanguageChange", async () => {
    const onLanguageChange = vi.fn<(language: string) => void>();
    render(
      <CodeSnippetDeck
        snippets={SNIPPETS}
        parameters={PARAMETERS}
        onLanguageChange={onLanguageChange}
      />,
    );

    await userEvent.click(screen.getByRole("tab", { name: "Python" }));

    expect(code()).toBe('requests.get("https://api.example.com/users", params={"limit": 20})');
    expect(onLanguageChange).toHaveBeenCalledWith("python");
  });

  it("编辑参数后代码立即更新，且支持一键重置恢复默认值", async () => {
    render(<CodeSnippetDeck snippets={SNIPPETS} parameters={PARAMETERS} />);
    const input = screen.getByRole("textbox", { name: "Limit" });

    await userEvent.clear(input);
    await userEvent.type(input, "5");
    expect(code()).toBe("curl https://api.example.com/users?limit=5");

    await userEvent.click(screen.getByRole("button", { name: "重置参数" }));
    expect(code()).toBe("curl https://api.example.com/users?limit=20");
  });

  it("支持点击参数快捷预设项更新代码", async () => {
    render(<CodeSnippetDeck snippets={SNIPPETS} parameters={PARAMETERS} />);

    await userEvent.click(screen.getByRole("button", { name: "50" }));
    expect(code()).toBe("curl https://api.example.com/users?limit=50");
  });

  it("复制按钮把代入参数后的当前代码写入剪贴板并触发 onCopy", async () => {
    const onCopy = vi.fn<(text: string, language: string) => void>();
    const user = userEvent.setup();
    render(<CodeSnippetDeck snippets={SNIPPETS} parameters={PARAMETERS} onCopy={onCopy} />);

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    expect(await navigator.clipboard.readText()).toBe(
      "curl https://api.example.com/users?limit=20",
    );
    expect(onCopy).toHaveBeenCalledWith("curl https://api.example.com/users?limit=20", "curl");
  });

  it("支持 variant、title、badge、行号与自动换行开关且不污染代码文本", async () => {
    render(
      <CodeSnippetDeck
        variant="terminal"
        title="/v1/users"
        badge="GET"
        showLineNumbers
        allowWrapToggle
        snippets={[
          { language: "curl", label: "cURL", code: "curl {{baseUrl}}/users\n  -H 'Accept: */*'" },
        ]}
        parameters={[PARAMETERS[0]!]}
      />,
    );

    const root = screen.getByTestId("snippet-code").closest('[data-slot="code-snippet-deck"]');
    expect(root?.getAttribute("data-variant")).toBe("terminal");
    expect(screen.getByText("GET")).toBeTruthy();
    expect(screen.getByText("/v1/users")).toBeTruthy();
    expect(code()).toBe("curl https://api.example.com/users\n  -H 'Accept: */*'");

    const wrapBtn = screen.getByRole("button", { name: "切换自动换行" });
    expect(wrapBtn.getAttribute("aria-pressed")).toBe("false");
    await userEvent.click(wrapBtn);
    expect(wrapBtn.getAttribute("aria-pressed")).toBe("true");
  });
});
