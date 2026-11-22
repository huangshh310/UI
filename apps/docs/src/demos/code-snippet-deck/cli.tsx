import { CodeSnippetDeck } from "@matt-ui/ui";

const INSTALL_SNIPPETS = [
  {
    language: "pnpm",
    label: "pnpm",
    code: "pnpm dlx shadcn@latest add huangshh310/UI/{{component}}",
  },
  { language: "npm", label: "npm", code: "npx shadcn@latest add huangshh310/UI/{{component}}" },
  { language: "bun", label: "bun", code: "bunx shadcn@latest add huangshh310/UI/{{component}}" },
];

export default function CodeSnippetDeckCliDemo() {
  return (
    <CodeSnippetDeck
      snippets={INSTALL_SNIPPETS}
      parameters={[{ name: "component", label: "组件名", defaultValue: "sheet" }]}
    />
  );
}
