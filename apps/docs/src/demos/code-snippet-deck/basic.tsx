/**
 * 示例：CodeSnippetDeck 主展示。曜石黑终端风格，支持语言切换、预设快捷芯片、聚焦联动高亮与自动换行。
 */
import { CodeSnippetDeck } from "@matt-ui/ui";

const SNIPPETS = [
  {
    language: "curl",
    label: "cURL",
    code: "curl {{baseUrl}}/v1/projects?limit={{limit}}",
  },
  {
    language: "ts",
    label: "TypeScript",
    code: 'await fetch("{{baseUrl}}/v1/projects?limit={{limit}}");',
  },
  {
    language: "python",
    label: "Python",
    code: 'requests.get("{{baseUrl}}/v1/projects", params={"limit": {{limit}}})',
  },
];

const PARAMETERS = [
  {
    name: "baseUrl",
    label: "Base URL",
    defaultValue: "https://api.tidewater.dev",
    placeholder: "https://api.example.com",
    options: ["https://api.tidewater.dev", "https://staging.tidewater.dev"],
  },
  {
    name: "limit",
    label: "Limit",
    defaultValue: "25",
    placeholder: "10 - 100",
    options: ["10", "25", "50", "100"],
  },
];

export const CodeSnippetDeckBasic = () => (
  <CodeSnippetDeck
    variant="terminal"
    badge="GET"
    title="/v1/projects"
    allowWrapToggle
    snippets={SNIPPETS}
    parameters={PARAMETERS}
  />
);
