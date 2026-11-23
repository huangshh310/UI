import AuthBlockBasicDemo from "@/demos/auth-block/basic";
import AuthBlockProvidersDemo from "@/demos/auth-block/providers";
import AuthBlockSplitDemo from "@/demos/auth-block/split";
import type { ComponentDoc } from "./registry.types";

export const AUTH_BLOCK_DOC: ComponentDoc = {
  slug: "auth-block",
  name: "Auth Block",
  description:
    "由 Card、LockInput、Separator 与 Button 组合而成的登录/注册认证区块，支持单卡居中、双栏品牌分屏、多 SSO 入口与校验态反馈。",
  category: "blocks",
  registryName: "auth-block",
  dependencies: ["class-variance-authority", "lucide-react"],
  usage: `import { AuthBlock } from "@/components/ui/auth-block";

<AuthBlock brandName="matt-ui" showForgotPassword onSubmit={(data) => console.log(data)} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "登录与注册认证卡",
      description:
        "邮箱与密码统一采用 LockInput 聚焦锁定环与显隐切换，100% 由本库基础原语拼装，自动携带全部组件依赖。",
      file: "auth-block/basic.tsx",
      Demo: AuthBlockBasicDemo,
    },
    {
      slug: "split",
      name: "双栏品牌分屏注册页",
      description:
        '通过 layout="split" 与 variant="elevated" 切换为左侧品牌指标展示 + 右侧表单的宽屏注册认证区块。',
      file: "auth-block/split.tsx",
      Demo: AuthBlockSplitDemo,
      directory: false,
    },
    {
      slug: "providers",
      name: "多 SSO 通道与紧凑校验态",
      description:
        '组合 ssoProviders、compact、variant="subtle" 与 error 提示横幅，适配弹窗与安全门禁登录场景。',
      file: "auth-block/providers.tsx",
      Demo: AuthBlockProvidersDemo,
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
    {
      name: "variant",
      type: '"default" | "elevated" | "subtle"',
      defaultValue: '"default"',
      description: "容器表面与阴影层级变体",
    },
    {
      name: "compact",
      type: "boolean",
      defaultValue: "false",
      description: "紧凑内边距与输入高度，适合弹窗或窄栏",
    },
    { name: "brandName", type: "string", defaultValue: '"matt-ui"', description: "标题品牌名" },
    {
      name: "tagline",
      type: "string",
      defaultValue: "随模式自动切换",
      description: "自定义副标题或品牌标语",
    },
    {
      name: "ssoProviders",
      type: "AuthSsoProvider[]",
      defaultValue: "企业单点登录",
      description: "自定义第三方或 Passkey 登录入口列表",
    },
    {
      name: "showForgotPassword",
      type: "boolean",
      defaultValue: "false",
      description: "登录态下在密码标签右侧展示「忘记密码？」入口",
    },
    {
      name: "error",
      type: "string",
      defaultValue: "—",
      description: '表单级错误提示，自动渲染 role="alert" 横幅',
    },
    {
      name: "loading",
      type: "boolean",
      defaultValue: "false",
      description: "提交按钮加载状态",
    },
    {
      name: "onSsoClick",
      type: "(providerId?: string) => void",
      defaultValue: "—",
      description: "点击 SSO 入口回调",
    },
    {
      name: "onForgotPassword",
      type: "() => void",
      defaultValue: "—",
      description: "点击「忘记密码？」回调",
    },
    {
      name: "onSubmit",
      type: "(payload: AuthPayload) => void",
      defaultValue: "—",
      description: "提交表单回调",
    },
  ],
  accessibility: [
    "所有输入项均复用 LockInput 的 useId 显式标签关联与单层焦点环，密码输入内置明暗文切换与键盘语义。",
    '错误提示横幅声明 role="alert"，双主题下均满足 WCAG AA 对比度门禁。',
  ],
};
