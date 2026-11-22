/**
 * CodeSnippetDeck 的行为规约：切换语言、编辑参数后代码随之更新、复制的是当前代码。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
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
  { name: "limit", label: "Limit", defaultValue: "20" },
];

/** 当前显示的代码 */
const code = () => screen.getByTestId("snippet-code").textContent;

describe("CodeSnippetDeck", () => {
  it("默认显示第一种语言，参数已代入默认值", () => {
    render(<CodeSnippetDeck snippets={SNIPPETS} parameters={PARAMETERS} />);

    expect(code()).toBe("curl https://api.example.com/users?limit=20");
  });

  it("切换语言页签后显示该语言的代码", async () => {
    render(<CodeSnippetDeck snippets={SNIPPETS} parameters={PARAMETERS} />);

    await userEvent.click(screen.getByRole("tab", { name: "Python" }));

    expect(code()).toBe('requests.get("https://api.example.com/users", params={"limit": 20})');
  });

  it("编辑参数后代码立即更新", async () => {
    render(<CodeSnippetDeck snippets={SNIPPETS} parameters={PARAMETERS} />);
    const input = screen.getByRole("textbox", { name: "Limit" });

    await userEvent.clear(input);
    await userEvent.type(input, "5");

    expect(code()).toBe("curl https://api.example.com/users?limit=5");
  });

  it("复制按钮把代入参数后的当前代码写入剪贴板", async () => {
    const user = userEvent.setup();
    render(<CodeSnippetDeck snippets={SNIPPETS} parameters={PARAMETERS} />);

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    expect(await navigator.clipboard.readText()).toBe(
      "curl https://api.example.com/users?limit=20",
    );
  });
});
