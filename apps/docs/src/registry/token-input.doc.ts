/**
 * TokenInput 的文档数据：结构化上下文标签输入框与退格策略说明。
 */
import { TokenInputBasic } from "@/demos/token-input/basic";
import { TokenInputDeletionModes } from "@/demos/token-input/deletion-modes";
import type { ComponentDoc } from "./registry.types";

export const TOKEN_INPUT_DOC: ComponentDoc = {
  slug: "token-input",
  name: "Token Input",
  description:
    "结构化上下文标签输入框，支持自然语言与原子化文件/技能胶囊内联混排编辑、光标触发插入及纯文本序列化。",
  category: "ai",
  registryName: "token-input",
  dependencies: [
    "@ui-sdk/react@0.1.0-beta.13",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  usage: `import { TokenInput } from "@/components/ui/token-input";

export function Example() {
  return (
    <TokenInput
      defaultValue={["总结 ", { type: "file", value: "README.md", label: "README.md" }]}
    />
  );
}`,
  createdAt: "2026-11-24",
  specimens: [
    {
      slug: "basic",
      name: "混合上下文胶囊编辑",
      description: "在提示词正文内联混排技能与文件胶囊，支持键入 @ / 实时插入并输出序列化纯文本。",
      file: "token-input/basic.tsx",
      Demo: TokenInputBasic,
    },
    {
      slug: "deletion-modes",
      name: "退格键删除策略对比",
      description: "在整块删除、二次退格确认删除与还原为纯文本三种编辑手感之间切换。",
      file: "token-input/deletion-modes.tsx",
      Demo: TokenInputDeletionModes,
      directory: false,
    },
  ],
  api: [
    {
      name: "value / defaultValue",
      type: "TokenInputSegment[]",
      defaultValue: "—",
      description: "字符串与 ContextToken 交替组成的受控或非受控片段数组",
    },
    {
      name: "triggers",
      type: "TokenTriggerSource[]",
      defaultValue: "—",
      description: "光标处呼出内联候选菜单并插入胶囊的触发规则",
    },
    {
      name: "tokenDeletion",
      type: '"whole" | "select" | "revert"',
      defaultValue: '"whole"',
      description: "按下退格键遇到胶囊时的删除或还原行为",
    },
    {
      name: "onValueChange / onSubmit",
      type: "(value: TokenInputSegment[], serialized: string) => void",
      defaultValue: "—",
      description: "同步回传结构化片段数组与纯文本序列化结果",
    },
  ],
  accessibility: [
    "每个内联胶囊作为不可拆分的原子语义单元导航，聚焦或二次确认选中时通过辅助播报提示删除方式。",
  ],
};
