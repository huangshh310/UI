"use client";

import { cn } from "@matt-ui/utils";
import { Shield } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "../button/index.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card/index.js";
import { LockInput } from "../lock-input/index.js";
import { Separator } from "../separator/index.js";
import type { AuthBlockProps, AuthMode } from "./auth-block.types.js";

const CredentialsForm = ({
  isLogin,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: {
  isLogin: boolean;
  email: string;
  password: string;
  onEmailChange: (next: string) => void;
  onPasswordChange: (next: string) => void;
  onSubmit: (event: FormEvent) => void;
}) => {
  const emailId = useId();
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={emailId} className="text-xs font-medium text-foreground">
          工作邮箱
        </label>
        <input
          id={emailId}
          type="email"
          required
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="name@company.com"
          className="h-9 rounded-lg border border-solid border-border bg-background px-3 font-sans text-sm text-foreground shadow-sm outline-none transition-[border-color,box-shadow] focus:border-ring focus:ring-3 focus:ring-ring/20 dark:bg-card"
        />
      </div>
      <LockInput
        label="密码"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        placeholder="输入访问密码"
      />
      <Button type="submit" variant="signal" className="mt-1 w-full">
        {isLogin ? "立即登录" : "创建工作区账号"}
      </Button>
    </form>
  );
};

const BrandShowcase = ({ brandName }: { brandName: string }) => (
  <div className="flex flex-col justify-between gap-8 rounded-xl border border-solid border-border/80 bg-secondary/45 p-7">
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-solid border-border bg-background px-3 py-1 font-mono text-[11px] text-muted-foreground dark:bg-card">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
        <span>{brandName} Design Platform</span>
      </div>
      <p className="m-0 mt-5 text-xl font-semibold tracking-tight text-foreground">
        统一设计 Token、无障碍组件与团队 Registry
      </p>
      <p className="m-0 mt-2 text-xs leading-relaxed text-muted-foreground">
        单点登录即刻同步私有组件清单、双主题对比度巡检与多环境发布流水线。
      </p>
    </div>
    <div className="grid grid-cols-2 gap-3 border-t border-solid border-border/75 pt-5">
      <div>
        <p className="m-0 font-mono text-lg font-semibold text-foreground tabular-nums">99.98%</p>
        <p className="m-0 mt-0.5 text-[11px] text-muted-foreground">边缘 Registry 可用率</p>
      </div>
      <div>
        <p className="m-0 font-mono text-lg font-semibold text-foreground tabular-nums">WCAG AA</p>
        <p className="m-0 mt-0.5 text-[11px] text-muted-foreground">双主题对比度门禁</p>
      </div>
    </div>
  </div>
);

interface AuthFormCardProps {
  isLogin: boolean;
  isCardLayout: boolean;
  brandName: string;
  email: string;
  password: string;
  onEmailChange: (next: string) => void;
  onPasswordChange: (next: string) => void;
  onToggleMode: () => void;
  onSsoClick?: () => void;
  onSubmit: (event: FormEvent) => void;
  className?: string;
}

const AuthFormCard = (p: AuthFormCardProps) => (
  <Card
    data-slot={p.isCardLayout ? "auth-block" : undefined}
    className={cn(p.isCardLayout ? "w-full max-w-sm" : "w-full border-0 shadow-none", p.className)}
  >
    <CardHeader>
      <div className="mb-2 inline-flex size-9 items-center justify-center rounded-xl bg-signal text-signal-foreground shadow-sm">
        <Shield aria-hidden="true" className="size-4" />
      </div>
      <CardTitle>{p.isLogin ? `登录 ${p.brandName}` : `创建 ${p.brandName} 账号`}</CardTitle>
      <CardDescription>
        {p.isLogin
          ? "使用 SSO 或工作邮箱进入团队控制台。"
          : "几秒内初始化你的组件与 Token 工作区。"}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <Button type="button" variant="outline" className="w-full" onClick={p.onSsoClick}>
        使用企业单点登录（SSO）
      </Button>
      <Separator label="或使用邮箱" />
      <CredentialsForm
        isLogin={p.isLogin}
        email={p.email}
        password={p.password}
        onEmailChange={p.onEmailChange}
        onPasswordChange={p.onPasswordChange}
        onSubmit={p.onSubmit}
      />
    </CardContent>
    <CardFooter muted className="justify-center text-xs text-muted-foreground">
      <span>{p.isLogin ? "还没有账号？" : "已有工作区账号？"}</span>
      <button
        type="button"
        onClick={p.onToggleMode}
        className="cursor-pointer border-0 bg-transparent p-0 font-medium text-signal underline-offset-4 hover:underline dark:text-ring"
      >
        {p.isLogin ? "注册新账号" : "返回登录"}
      </button>
    </CardFooter>
  </Card>
);

export const AuthBlock = (props: AuthBlockProps) => {
  const { defaultMode = "login", layout = "card", brandName = "matt-ui" } = props;
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLogin = mode === "login";

  const formCard = (
    <AuthFormCard
      isLogin={isLogin}
      isCardLayout={layout === "card"}
      brandName={brandName}
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onToggleMode={() => setMode(isLogin ? "signup" : "login")}
      onSsoClick={props.onSsoClick}
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit?.({ mode, email, password });
      }}
      className={layout === "card" ? props.className : undefined}
    />
  );

  if (layout === "split") {
    return (
      <div
        data-slot="auth-block"
        className={cn(
          "grid w-full max-w-4xl grid-cols-1 gap-4 rounded-2xl border border-solid border-border bg-card p-3 shadow-sm md:grid-cols-2",
          props.className,
        )}
      >
        <BrandShowcase brandName={brandName} />
        <div className="flex items-center justify-center">{formCard}</div>
      </div>
    );
  }

  return formCard;
};
