/**
 * 示例：极简 CLI 安装命令条，隐藏窗口装饰点，支持组件名快捷预设芯片。
 */
import { CodeSnippetDeck } from "@matt-ui/ui";

const INSTALL_SNIPPETS = [
  {
    language: "pnpm",
    label: "pnpm",
    code: "pnpm dlx shadcn@latest add huangshh310/UI/{{component}}",
  },
  {
    language: "npm",
    label: "npm",
    code: "npx shadcn@latest add huangshh310/UI/{{component}}",
  },
  {
    language: "bun",
    label: "bun",
    code: "bunx shadcn@latest add huangshh310/UI/{{component}}",
  },
];

export default function CodeSnippetDeckCliDemo() {
  return (
    <CodeSnippetDeck
      variant="minimal"
      badge="CLI"
      snippets={INSTALL_SNIPPETS}
      parameters={[
        {
          name: "component",
          label: "组件名",
          defaultValue: "code-snippet-deck",
          options: ["lock-input", "draw-checkbox", "code-snippet-deck", "sheet"],
        },
      ]}
    />
  );
}
