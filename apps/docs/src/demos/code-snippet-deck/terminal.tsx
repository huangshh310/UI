/**
 * 示例：多行 AI 接口请求，开启行号槽、自动换行开关与模型参数预设芯片。
 */
import { CodeSnippetDeck } from "@matt-ui/ui";

const AI_SNIPPETS = [
  {
    language: "curl",
    label: "cURL",
    filename: "responses.sh",
    code: [
      "curl https://api.matt-ui.dev/v1/responses \\",
      '  -H "Authorization: Bearer $API_KEY" \\',
      '  -H "Content-Type: application/json" \\',
      "  -d '{",
      '    "model": "{{model}}",',
      '    "temperature": {{temperature}},',
      '    "input": "设计一个柔和的卡片动效"',
      "  }'",
    ].join("\n"),
  },
  {
    language: "ts",
    label: "TypeScript",
    filename: "responses.ts",
    code: [
      'import { createClient } from "@matt-ui/sdk";',
      "",
      "const client = createClient({ apiKey: process.env.API_KEY });",
      "const res = await client.responses.create({",
      '  model: "{{model}}",',
      "  temperature: {{temperature}},",
      '  input: "设计一个柔和的卡片动效",',
      "});",
    ].join("\n"),
  },
  {
    language: "python",
    label: "Python",
    filename: "responses.py",
    code: [
      "from matt_sdk import Client",
      "",
      "client = Client()",
      "res = client.responses.create(",
      '    model="{{model}}",',
      "    temperature={{temperature}},",
      '    input="设计一个柔和的卡片动效",',
      ")",
    ].join("\n"),
  },
];

const AI_PARAMETERS = [
  {
    name: "model",
    label: "模型 Model",
    defaultValue: "gemini-2.5-pro",
    options: ["gemini-2.5-pro", "claude-4-sonnet", "gpt-5"],
  },
  {
    name: "temperature",
    label: "温度 Temperature",
    defaultValue: "0.7",
    options: ["0.2", "0.7", "1.0"],
  },
];

export default function CodeSnippetDeckTerminalDemo() {
  return (
    <CodeSnippetDeck
      variant="terminal"
      badge="POST"
      showLineNumbers
      allowWrapToggle
      snippets={AI_SNIPPETS}
      parameters={AI_PARAMETERS}
    />
  );
}
