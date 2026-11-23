"use client";

/**
 * AuthBlock 内部子区块：品牌展示侧栏、SSO 入口、凭据表单与底部模式切换。
 */
import { cn } from "@matt-ui/utils";
import { AlertCircle, KeyRound, Lock, Mail } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "../button/index.js";
import { CardFooter } from "../card/index.js";
import { LockInput } from "../lock-input/index.js";
import type { AuthSsoProvider } from "./auth-block.types.js";
import { AUTH_SHOWCASE_METRICS, authShowcaseVariants } from "./auth-block.variants.js";

export interface CredentialsFormProps {
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

export const CredentialsForm = (p: CredentialsFormProps) => {
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

export const SsoActionGroup = ({
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

export const BrandShowcase = ({
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

export const AuthFooter = ({ isLogin, onToggle }: { isLogin: boolean; onToggle: () => void }) => (
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
