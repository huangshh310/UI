export type AuthMode = "login" | "signup";
export type AuthLayout = "card" | "split";

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
  /** 品牌名称 */
  brandName?: string;
  /** SSO 登录回调 */
  onSsoClick?: () => void;
  /** 表单提交回调 */
  onSubmit?: (payload: AuthPayload) => void;
  /** 自定义类名 */
  className?: string;
}
