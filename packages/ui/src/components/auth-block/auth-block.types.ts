import type { ReactNode } from "react";

export type AuthMode = "login" | "signup";
export type AuthLayout = "card" | "split";
export type AuthBlockVariant = "default" | "elevated" | "subtle";

export interface AuthSsoProvider {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface AuthPayload {
  mode: AuthMode;
  email: string;
  password: string;
}

export interface AuthBlockProps {
  /** 默认模式 */
  defaultMode?: AuthMode;
  /** 布局样式：单卡居中或双栏品牌分屏 */
  layout?: AuthLayout;
  /** 容器视觉变体：标准发丝描边、浮层阴影或柔和内嵌 */
  variant?: AuthBlockVariant;
  /** 紧凑模式，适合弹窗或窄容器内嵌 */
  compact?: boolean;
  /** 品牌名称 */
  brandName?: string;
  /** 副标题或品牌标语；省略时随模式自动切换 */
  tagline?: string;
  /** 自定义第三方 / 企业单点登录入口列表 */
  ssoProviders?: AuthSsoProvider[];
  /** 登录模式下是否在密码栏右侧显示「忘记密码？」入口 */
  showForgotPassword?: boolean;
  /** 表单级错误提示，传入后高亮输入边框并播报 alert */
  error?: string;
  /** 提交按钮加载状态 */
  loading?: boolean;
  /** SSO 登录回调 */
  onSsoClick?: (providerId?: string) => void;
  /** 点击「忘记密码？」回调 */
  onForgotPassword?: () => void;
  /** 表单提交回调 */
  onSubmit?: (payload: AuthPayload) => void;
  /** 自定义类名 */
  className?: string;
}
