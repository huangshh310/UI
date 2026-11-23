/**
 * 示例：双层浮雕画框（elevated）与多文件切换，实时调整主题主色与圆角 Token。
 */
import { CodeSnippetDeck } from "@matt-ui/ui";

const THEME_SNIPPETS = [
  {
    language: "css",
    label: "CSS",
    filename: "theme.css",
    code: [":root {", "  --ui-signal: {{accent}};", "  --ui-radius-card: {{radius}};", "}"].join(
      "\n",
    ),
  },
  {
    language: "ts",
    label: "TypeScript",
    filename: "tokens.ts",
    code: [
      "export const brandTheme = {",
      '  signal: "{{accent}}",',
      '  cardRadius: "{{radius}}",',
      "} as const;",
    ].join("\n"),
  },
];

const THEME_PARAMETERS = [
  {
    name: "accent",
    label: "信号色 Accent",
    defaultValue: "#2563eb",
    options: ["#2563eb", "#7c3aed", "#059669", "#ea580c"],
  },
  {
    name: "radius",
    label: "卡片圆角 Radius",
    defaultValue: "20px",
    options: ["12px", "16px", "20px", "28px"],
  },
];

export default function CodeSnippetDeckElevatedDemo() {
  return (
    <CodeSnippetDeck
      variant="elevated"
      badge="THEME"
      showLineNumbers
      snippets={THEME_SNIPPETS}
      parameters={THEME_PARAMETERS}
    />
  );
}
