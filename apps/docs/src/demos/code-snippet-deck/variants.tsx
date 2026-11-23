/**
 * 示例：四种视觉风格（default / terminal / elevated / minimal）并排对比。
 */
import { CodeSnippetDeck } from "@matt-ui/ui";

const SHORT_SNIPPETS = [
  { language: "curl", label: "cURL", code: "curl -s https://api.matt-ui.dev/v1/{{resource}}" },
  { language: "ts", label: "TS", code: 'await sdk.get("/v1/{{resource}}");' },
];

const STATIC_SNIPPETS = [
  { language: "pnpm", label: "pnpm", code: "pnpm dlx shadcn@latest add huangshh310/UI/button" },
  { language: "npm", label: "npm", code: "npx shadcn@latest add huangshh310/UI/button" },
];

const SHARED_PARAMS = [{ name: "resource", label: "资源路径", defaultValue: "components" }];

export default function CodeSnippetDeckVariantsDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-5">
      <CodeSnippetDeck
        variant="default"
        badge="DEFAULT"
        title="浅色编辑卡"
        snippets={SHORT_SNIPPETS}
        parameters={SHARED_PARAMS}
      />
      <CodeSnippetDeck
        variant="terminal"
        badge="TERMINAL"
        title="曜石黑终端"
        snippets={SHORT_SNIPPETS}
        parameters={SHARED_PARAMS}
      />
      <CodeSnippetDeck
        variant="elevated"
        badge="ELEVATED"
        title="双层浮雕画框"
        snippets={SHORT_SNIPPETS}
        parameters={SHARED_PARAMS}
      />
      <CodeSnippetDeck
        variant="minimal"
        badge="MINIMAL"
        title="极简命令条"
        snippets={STATIC_SNIPPETS}
      />
    </div>
  );
}
