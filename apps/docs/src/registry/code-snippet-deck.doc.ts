/**
 * Code Snippet Deck 的文档数据。
 */
import { CodeSnippetDeckBasic } from "@/demos/code-snippet-deck/basic";
import type { ComponentDoc } from "./registry.types";

export const CODE_SNIPPET_DECK_DOC: ComponentDoc = {
  slug: "code-snippet-deck",
  name: "Code Snippet Deck",
  description: "同一个接口调用的多语言代码片段，参数可编辑并实时代入。",
  category: "buttons",
  registryName: "code-snippet-deck",
  dependencies: ["@base-ui/react", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { CodeSnippetDeck } from "@/components/ui/code-snippet-deck";

export function Demo() {
  return <CodeSnippetDeck snippets={snippets} parameters={parameters} />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "code-snippet-deck-basic",
      name: "多语言片段",
      description: "切换语言页签，修改参数，代码随之更新。",
      file: "code-snippet-deck/basic.tsx",
      Demo: CodeSnippetDeckBasic,
    },
  ],
  api: [
    {
      name: "snippets",
      type: "Snippet[]",
      defaultValue: "-",
      description: "各语言的代码模板，{{参数名}} 会被替换。",
    },
    {
      name: "parameters",
      type: "SnippetParameter[]",
      defaultValue: "[]",
      description: "可编辑的参数。",
    },
    {
      name: "showWindowBar",
      type: "boolean",
      defaultValue: "true",
      description: "是否显示顶部窗口栏。",
    },
  ],
  accessibility: [
    "语言页签的键盘导航与 ARIA 语义由 Base UI 的 Tabs 提供。",
    "参数输入框都有可见标签。",
    "复制结果会被播报。",
  ],
};
