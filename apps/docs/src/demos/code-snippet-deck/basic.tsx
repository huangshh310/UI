/**
 * 示例：CodeSnippetDeck。切换语言，修改参数，代码随之更新。
 */
import { CodeSnippetDeck } from "@matt-ui/ui";

const SNIPPETS = [
  { language: "curl", label: "cURL", code: "curl {{baseUrl}}/v1/projects?limit={{limit}}" },
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
  { name: "baseUrl", label: "Base URL", defaultValue: "https://api.tidewater.dev" },
  { name: "limit", label: "Limit", defaultValue: "25" },
];

export const CodeSnippetDeckBasic = () => (
  <CodeSnippetDeck snippets={SNIPPETS} parameters={PARAMETERS} />
);
