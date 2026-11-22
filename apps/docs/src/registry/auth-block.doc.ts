import AuthBlockBasicDemo from "@/demos/auth-block/basic";
import AuthBlockSplitDemo from "@/demos/auth-block/split";
import type { ComponentDoc } from "./registry.types";

export const AUTH_BLOCK_DOC: ComponentDoc = {
  slug: "auth-block",
  name: "Auth Block",
  description:
    "由 Card、LockInput、Separator 与 Button 组合而成的登录/注册认证区块，支持单卡居中与双栏品牌分屏两种布局。",
  category: "blocks",
  registryName: "auth-block",
  dependencies: ["lucide-react"],
  usage: `import { AuthBlock } from "@/components/ui/auth-block";

<AuthBlock brandName="matt-ui" onSubmit={(data) => console.log(data)} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "登录与注册认证卡",
      description: "零重复样式体系，100% 由本库基础原语拼装，通过 Registry 自动携带全部组件依赖。",
      file: "auth-block/basic.tsx",
      Demo: AuthBlockBasicDemo,
    },
    {
      slug: "split",
      name: "双栏品牌分屏注册页",
      description: '通过 layout="split" 切换为左侧品牌指标展示 + 右侧表单的宽屏注册认证区块。',
      file: "auth-block/split.tsx",
      Demo: AuthBlockSplitDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "defaultMode",
      type: '"login" | "signup"',
      defaultValue: '"login"',
      description: "初始模式",
    },
    {
      name: "layout",
      type: '"card" | "split"',
      defaultValue: '"card"',
      description: "单卡居中或双栏品牌分屏布局",
    },
    { name: "brandName", type: "string", defaultValue: '"matt-ui"', description: "标题品牌名" },
    {
      name: "onSubmit",
      type: "(payload: AuthPayload) => void",
      defaultValue: "—",
      description: "提交表单回调",
    },
  ],
  accessibility: [
    "所有输入项均使用 useId 显式关联 label，密码输入复用 LockInput 的明暗文切换与键盘语义。",
  ],
};
