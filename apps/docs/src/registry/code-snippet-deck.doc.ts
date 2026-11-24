/**
 * Code Snippet Deck 的文档数据。
 */
import { CodeSnippetDeckBasic } from "@/demos/code-snippet-deck/basic";
import CodeSnippetDeckCliDemo from "@/demos/code-snippet-deck/cli";
import CodeSnippetDeckElevatedDemo from "@/demos/code-snippet-deck/elevated";
import CodeSnippetDeckTerminalDemo from "@/demos/code-snippet-deck/terminal";
import CodeSnippetDeckVariantsDemo from "@/demos/code-snippet-deck/variants";
import type { ComponentDoc } from "./registry.types";

export const CODE_SNIPPET_DECK_DOC: ComponentDoc = {
  slug: "code-snippet-deck",
  name: "Code Snippet Deck",
  description:
    "多语言交互式代码面板：支持曜石黑终端、双层浮雕画框与极简命令条，实时高亮参数代入、一键预设芯片、行号槽与自动换行。",
  category: "buttons",
  registryName: "code-snippet-deck",
  dependencies: [
    "@base-ui/react",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  usage: `import { CodeSnippetDeck } from "@/components/ui/code-snippet-deck";

export function Demo() {
  return (
    <CodeSnippetDeck
      variant="terminal"
      badge="GET"
      title="/v1/projects"
      allowWrapToggle
      snippets={snippets}
      parameters={parameters}
    />
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "code-snippet-deck-basic",
      name: "多语言交互代码卡",
      description:
        "曜石黑终端风格，切换语言页签或点击预设芯片时代码实时高亮代入，聚焦参数框联动聚焦对应片段。",
      file: "code-snippet-deck/basic.tsx",
      Demo: CodeSnippetDeckBasic,
    },
    {
      slug: "terminal",
      name: "多行 AI 接口与行号槽",
      description: "开启行号槽、按语言切换独立文件名、自动换行按钮与模型预设芯片。",
      file: "code-snippet-deck/terminal.tsx",
      Demo: CodeSnippetDeckTerminalDemo,
      directory: false,
    },
    {
      slug: "elevated",
      name: "双层浮雕画框与 Token 调试",
      description: "精致双层微边框外框，适合浅色文档页展示主题与配置文件。",
      file: "code-snippet-deck/elevated.tsx",
      Demo: CodeSnippetDeckElevatedDemo,
      directory: false,
    },
    {
      slug: "cli",
      name: "极简 CLI 安装命令条",
      description:
        "minimal 变体自动收起窗口装饰点，点选组件芯片即可更新 pnpm / npm / bun 安装命令。",
      file: "code-snippet-deck/cli.tsx",
      Demo: CodeSnippetDeckCliDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "四种视觉风格对比",
      description: "一次性预览 default、terminal、elevated、minimal 四套视觉变体。",
      file: "code-snippet-deck/variants.tsx",
      Demo: CodeSnippetDeckVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "snippets",
      type: "Snippet[]",
      defaultValue: "-",
      description: "各语言的代码模板，支持可选 filename，模板中的 {{参数名}} 会被实时代入并高亮。",
    },
    {
      name: "parameters",
      type: "SnippetParameter[]",
      defaultValue: "[]",
      description: "可编辑的参数列表，支持 placeholder 与快捷预设芯片 options。",
    },
    {
      name: "variant",
      type: '"default" | "terminal" | "elevated" | "minimal"',
      defaultValue: '"default"',
      description: "视觉风格：浅色编辑卡、曜石黑终端、双层浮雕画框或极简命令条。",
    },
    {
      name: "title / badge",
      type: "string",
      defaultValue: "-",
      description: "顶栏标题（如接口路径或文件名）与前置状态徽章（如 GET / POST / CLI）。",
    },
    {
      name: "showWindowBar",
      type: "boolean",
      defaultValue: "true",
      description: "是否显示顶部的 macOS 窗口装饰点；minimal 变体默认隐藏。",
    },
    {
      name: "showLineNumbers",
      type: "boolean",
      defaultValue: "false",
      description: "是否在代码左侧渲染独立行号槽（不会污染复制内容与文本选中）。",
    },
    {
      name: "highlightParameters",
      type: "boolean",
      defaultValue: "true",
      description: "高亮代码中由参数代入的片段，并在聚焦对应参数输入框时加深聚焦色。",
    },
    {
      name: "wrapLines / allowWrapToggle",
      type: "boolean",
      defaultValue: "false",
      description: "默认是否自动换行，以及是否在顶栏提供自动换行切换按钮。",
    },
    {
      name: "language / defaultLanguage / onLanguageChange",
      type: "string / (lang: string) => void",
      defaultValue: "-",
      description: "受控或非受控当前语言标识及切换回调。",
    },
    {
      name: "onCopy",
      type: "(code: string, language: string) => void",
      defaultValue: "-",
      description: "点击复制按钮并写入剪贴板后的回调。",
    },
  ],
  accessibility: [
    "语言切换页签支持完整的方向键导航与标准 tablist 无障碍语义。",
    "所有参数输入框都有显式关联标签，支持键盘聚焦并联动高亮代码中的对应片段。",
    "行号槽标注 aria-hidden，复制内容与屏幕阅读器均不受行号干扰，复制结果通过状态区域播报。",
  ],
};
