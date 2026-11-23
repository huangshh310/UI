// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AuthBlock：由 Card、LockInput、Separator 与 Button 组合而成的登录/注册认证区块。
 */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LockInput } from "@/components/ui/lock-input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { AlertCircle, KeyRound, Lock, Mail, Shield } from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";

export const authCardVariants = cva(
  "w-full border border-solid transition-shadow duration-(--ui-duration-fast)",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-card shadow-sm dark:border-white/10",
        elevated:
          "border-border/80 bg-card shadow-lg dark:border-white/12 dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
        subtle: "border-border/70 bg-secondary/35 shadow-none dark:border-white/10 dark:bg-card/80",
      },
      compact: {
        true: "max-w-[360px]",
        false: "max-w-[400px]",
      },
    },
    defaultVariants: {
      variant: "default",
      compact: false,
    },
  },
);

export const authSplitFrameVariants = cva(
  "grid w-full max-w-4xl grid-cols-1 gap-4 rounded-[24px] border border-solid md:grid-cols-2",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-card shadow-sm dark:border-white/10",
        elevated:
          "border-border/80 bg-card shadow-lg dark:border-white/12 dark:shadow-[0_20px_48px_rgba(0,0,0,0.45)]",
        subtle: "border-border/70 bg-secondary/30 shadow-none dark:border-white/10 dark:bg-card/80",
      },
      compact: {
        true: "p-2.5",
        false: "p-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      compact: false,
    },
  },
);

export const authShowcaseVariants = cva(
  "flex flex-col justify-between gap-7 rounded-[18px] border border-solid border-border/80 bg-secondary/45 dark:border-white/10 dark:bg-white/[0.03]",
  {
    variants: {
      compact: {
        true: "p-5",
        false: "p-7",
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export const AUTH_SHOWCASE_METRICS = [
  { value: "99.98%", label: "边缘 Registry 可用率" },
  { value: "WCAG AA", label: "双主题对比度门禁" },
] as const;
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
interface CredentialsFormProps {
  isLogin: boolean;
  compact: boolean;
  email: string;
  password: string;
  error?: string;
  loading?: boolean;
  showForgotPassword?: boolean;
  onEmailChange: (next: string) => void;
  onPasswordChange: (next: string) => void;
  onForgotPassword?: () => void;
  onSubmit: (event: FormEvent) => void;
}

const ForgotPasswordButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="cursor-pointer rounded-sm border-0 bg-transparent p-0 font-sans text-xs font-medium text-muted-foreground underline-offset-4 transition-colors outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring"
  >
    忘记密码？
  </button>
);

const AuthErrorBanner = ({ message }: { message: string }) => (
  <div
    role="alert"
    className="flex items-start gap-2 rounded-xl border border-solid border-destructive/40 bg-destructive/8 px-3 py-2.5 text-xs leading-relaxed text-rose-800 dark:border-destructive dark:bg-destructive/15 dark:text-rose-200"
  >
    <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
    <span>{message}</span>
  </div>
);

const CredentialsForm = (p: CredentialsFormProps) => {
  const fieldSize = p.compact ? "sm" : "md";
  const passwordExtra =
    p.isLogin && p.showForgotPassword ? (
      <ForgotPasswordButton onClick={p.onForgotPassword} />
    ) : undefined;

  return (
    <form onSubmit={p.onSubmit} className={cn("flex flex-col", p.compact ? "gap-3" : "gap-3.5")}>
      {p.error && <AuthErrorBanner message={p.error} />}
      <LockInput
        label="工作邮箱"
        type="email"
        required
        size={fieldSize}
        value={p.email}
        onChange={(event) => p.onEmailChange(event.target.value)}
        placeholder="name@company.com"
        prefix={<Mail aria-hidden="true" className="size-4" />}
        aria-invalid={Boolean(p.error) || undefined}
        containerClassName="max-w-none"
      />
      <LockInput
        label="密码"
        type="password"
        revealable
        size={fieldSize}
        value={p.password}
        onChange={(event) => p.onPasswordChange(event.target.value)}
        placeholder="输入访问密码"
        prefix={<Lock aria-hidden="true" className="size-4" />}
        aria-invalid={Boolean(p.error) || undefined}
        labelExtra={passwordExtra}
        containerClassName="max-w-none"
      />
      <Button
        type="submit"
        variant="primary"
        size={p.compact ? "md" : "lg"}
        loading={p.loading}
        className="mt-1.5 w-full rounded-xl"
      >
        {p.isLogin ? "立即登录" : "创建工作区账号"}
      </Button>
    </form>
  );
};

const SsoActionGroup = ({
  providers,
  compact,
  onSsoClick,
}: {
  providers?: AuthSsoProvider[];
  compact: boolean;
  onSsoClick?: (providerId?: string) => void;
}) => {
  const size = compact ? "md" : "lg";
  if (!providers || providers.length === 0) {
    return (
      <Button
        type="button"
        variant="outline"
        size={size}
        className="w-full rounded-xl border-border/80 text-sm dark:border-white/10"
        onClick={() => onSsoClick?.("sso")}
      >
        <KeyRound aria-hidden="true" className="size-4 text-muted-foreground" />
        <span>使用企业单点登录（SSO）</span>
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-2",
        providers.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2",
      )}
    >
      {providers.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="outline"
          size={size}
          className="w-full rounded-xl border-border/80 text-xs dark:border-white/10"
          onClick={() => onSsoClick?.(provider.id)}
        >
          {provider.icon}
          <span className="truncate">{provider.label}</span>
        </Button>
      ))}
    </div>
  );
};

const BrandShowcase = ({
  brandName,
  tagline,
  compact,
}: {
  brandName: string;
  tagline?: string;
  compact: boolean;
}) => (
  <div className={authShowcaseVariants({ compact })}>
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-solid border-border/80 bg-background px-3 py-1 font-mono text-[11px] text-muted-foreground dark:border-white/10 dark:bg-card">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
        <span>{brandName} Design Platform</span>
      </div>
      <p className="m-0 mt-5 text-xl leading-snug font-semibold tracking-[-0.025em] text-foreground">
        统一设计 Token、无障碍组件与团队 Registry
      </p>
      <p className="m-0 mt-2.5 text-xs leading-relaxed text-muted-foreground">
        {tagline ?? "单点登录即刻同步私有组件清单、双主题对比度巡检与多环境发布流水线。"}
      </p>
    </div>
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 border-t border-solid border-border/75 pt-5 dark:border-white/10">
        {AUTH_SHOWCASE_METRICS.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-solid border-border/70 bg-background/80 p-3 dark:border-white/10 dark:bg-card/70"
          >
            <p className="m-0 font-mono text-base font-semibold tracking-tight text-foreground tabular-nums">
              {item.value}
            </p>
            <p className="m-0 mt-0.5 text-[11px] text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
      <p className="m-0 font-mono text-[11px] text-muted-foreground">
        SOC 2 Type II · SAML 2.0 & Passkey 就绪
      </p>
    </div>
  </div>
);

const AuthFooter = ({ isLogin, onToggle }: { isLogin: boolean; onToggle: () => void }) => (
  <CardFooter
    muted
    className="justify-center gap-1.5 border-border/80 text-xs text-muted-foreground dark:border-white/10"
  >
    <span>{isLogin ? "还没有账号？" : "已有工作区账号？"}</span>
    <button
      type="button"
      onClick={onToggle}
      className="cursor-pointer rounded-sm border-0 bg-transparent p-0 font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
    >
      {isLogin ? "注册新账号" : "返回登录"}
    </button>
  </CardFooter>
);
interface AuthFormCardProps {
  isLogin: boolean;
  isCardLayout: boolean;
  variant: AuthBlockVariant;
  compact: boolean;
  brandName: string;
  tagline?: string;
  ssoProviders?: AuthSsoProvider[];
  showForgotPassword?: boolean;
  error?: string;
  loading?: boolean;
  email: string;
  password: string;
  onEmailChange: (next: string) => void;
  onPasswordChange: (next: string) => void;
  onToggleMode: () => void;
  onSsoClick?: (providerId?: string) => void;
  onForgotPassword?: () => void;
  onSubmit: (event: FormEvent) => void;
  className?: string;
}

const AuthFormCard = (p: AuthFormCardProps) => {
  const defaultDesc = p.isLogin
    ? "使用单点登录或工作邮箱进入你的空间"
    : "几秒内开启你的专属产品空间";

  return (
    <Card
      data-slot={p.isCardLayout ? "auth-block" : undefined}
      data-variant={p.isCardLayout ? p.variant : undefined}
      className={cn(
        p.isCardLayout
          ? authCardVariants({ variant: p.variant, compact: p.compact })
          : "w-full border-0 bg-transparent shadow-none",
        p.className,
      )}
    >
      <CardHeader className={cn("items-center text-center", p.compact && "px-5 pt-5 pb-2")}>
        <div className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-solid border-border/80 bg-secondary/70 text-foreground shadow-xs dark:border-white/10 dark:bg-white/[0.05]">
          <Shield aria-hidden="true" className="size-5" />
        </div>
        <CardTitle className="text-lg tracking-[-0.025em]">
          {p.isLogin ? `登录 ${p.brandName}` : `创建 ${p.brandName} 账号`}
        </CardTitle>
        <CardDescription>{p.tagline ?? defaultDesc}</CardDescription>
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-4", p.compact && "gap-3 px-5 py-2.5")}>
        <SsoActionGroup providers={p.ssoProviders} compact={p.compact} onSsoClick={p.onSsoClick} />
        <Separator label="或使用邮箱" />
        <CredentialsForm
          isLogin={p.isLogin}
          compact={p.compact}
          email={p.email}
          password={p.password}
          error={p.error}
          loading={p.loading}
          showForgotPassword={p.showForgotPassword}
          onEmailChange={p.onEmailChange}
          onPasswordChange={p.onPasswordChange}
          onForgotPassword={p.onForgotPassword}
          onSubmit={p.onSubmit}
        />
      </CardContent>
      <AuthFooter isLogin={p.isLogin} onToggle={p.onToggleMode} />
    </Card>
  );
};

const resolveAuthDefaults = (props: AuthBlockProps) => ({
  defaultMode: props.defaultMode ?? "login",
  layout: props.layout ?? "card",
  variant: props.variant ?? "default",
  compact: props.compact ?? false,
  brandName: props.brandName ?? "matt-ui",
});

export const AuthBlock = (props: AuthBlockProps) => {
  const cfg = resolveAuthDefaults(props);
  const [mode, setMode] = useState<AuthMode>(cfg.defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLogin = mode === "login";

  const formCard = (
    <AuthFormCard
      isLogin={isLogin}
      isCardLayout={cfg.layout === "card"}
      variant={cfg.variant}
      compact={cfg.compact}
      brandName={cfg.brandName}
      tagline={cfg.layout === "card" ? props.tagline : undefined}
      ssoProviders={props.ssoProviders}
      showForgotPassword={props.showForgotPassword}
      error={props.error}
      loading={props.loading}
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onToggleMode={() => setMode(isLogin ? "signup" : "login")}
      onSsoClick={props.onSsoClick}
      onForgotPassword={props.onForgotPassword}
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit?.({ mode, email, password });
      }}
      className={cfg.layout === "card" ? props.className : undefined}
    />
  );

  if (cfg.layout === "split") {
    return (
      <div
        data-slot="auth-block"
        data-variant={cfg.variant}
        className={cn(
          authSplitFrameVariants({ variant: cfg.variant, compact: cfg.compact }),
          props.className,
        )}
      >
        <BrandShowcase brandName={cfg.brandName} tagline={props.tagline} compact={cfg.compact} />
        <div className="flex items-center justify-center">{formCard}</div>
      </div>
    );
  }

  return formCard;
};
