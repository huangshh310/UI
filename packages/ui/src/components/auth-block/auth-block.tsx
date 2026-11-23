"use client";

/**
 * AuthBlock：由 Card、LockInput、Separator 与 Button 组合而成的登录/注册认证区块。
 */
import { cn } from "@matt-ui/utils";
import { Shield } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card/index.js";
import { Separator } from "../separator/index.js";
import { AuthFooter, BrandShowcase, CredentialsForm, SsoActionGroup } from "./auth-block-parts.js";
import type {
  AuthBlockProps,
  AuthBlockVariant,
  AuthMode,
  AuthSsoProvider,
} from "./auth-block.types.js";
import { authCardVariants, authSplitFrameVariants } from "./auth-block.variants.js";

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
