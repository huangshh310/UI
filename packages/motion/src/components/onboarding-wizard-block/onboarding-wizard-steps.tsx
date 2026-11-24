"use client";

import { cn } from "@matt-ui/utils";
import { Check, CheckCircle2, Globe, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useId } from "react";
import { NumberFlow } from "../number-flow/index.js";
import { OtpInput } from "../otp-input/index.js";
import { StretchSwitch } from "../stretch-switch/index.js";
import {
  WIZARD_REGIONS,
  WIZARD_STEPS,
  type WizardRegionOption,
  type WizardStepMeta,
} from "./onboarding-wizard-block.variants.js";

const StepBadgeItem = ({
  item,
  done,
  active,
  canJump,
  onSelect,
}: {
  item: WizardStepMeta;
  done: boolean;
  active: boolean;
  canJump: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    disabled={!canJump}
    aria-current={active ? "step" : undefined}
    onClick={onSelect}
    className={cn(
      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
      canJump && "cursor-pointer hover:bg-accent",
      active
        ? "bg-secondary text-foreground"
        : done
          ? "bg-muted/75 text-foreground"
          : "bg-muted/40 text-muted-foreground",
    )}
  >
    <span
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold",
        done
          ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950"
          : active
            ? "bg-primary text-primary-foreground"
            : "bg-background text-muted-foreground",
      )}
    >
      {done ? <Check aria-hidden="true" className="size-3.5" /> : item.id + 1}
    </span>
    <div className="min-w-0">
      <p className="m-0 truncate font-medium">{item.title}</p>
      <p className="m-0 hidden truncate text-[11px] text-muted-foreground sm:block">{item.hint}</p>
    </div>
  </button>
);

const StepProgressTrack = ({ pct, reduced }: { pct: number; reduced: boolean | null }) => (
  <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
    <motion.div
      className="h-full rounded-full bg-primary"
      initial={false}
      animate={{ width: `${pct}%` }}
      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 32 }}
    />
  </div>
);

interface StepHeaderProps {
  title: string;
  description: string;
  step: number;
  pct: number;
  reduced: boolean | null;
  allowStepJump: boolean;
  completed: boolean;
  onSelectStep: (idx: number) => void;
}

export const StepHeader = (p: StepHeaderProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p className="m-0 text-base font-semibold tracking-tight text-foreground">{p.title}</p>
        <p className="m-0 mt-0.5 text-xs text-muted-foreground">{p.description}</p>
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
        <span className="text-xs text-muted-foreground">完成度</span>
        <NumberFlow value={p.pct} suffix="%" className="text-xs font-semibold text-foreground" />
      </div>
    </div>
    <StepProgressTrack pct={p.pct} reduced={p.reduced} />
    <div className="grid grid-cols-3 gap-2">
      {WIZARD_STEPS.map((item) => {
        const done = p.step > item.id;
        return (
          <StepBadgeItem
            key={item.id}
            item={item}
            done={done}
            active={p.step === item.id}
            canJump={p.allowStepJump && done && !p.completed}
            onSelect={() => p.onSelectStep(item.id)}
          />
        );
      })}
    </div>
  </div>
);

const RegionCard = ({
  item,
  selected,
  onSelect,
}: {
  item: WizardRegionOption;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onSelect}
    className={cn(
      "flex cursor-pointer flex-col gap-1.5 rounded-xl border border-solid px-3.5 py-2.5 text-left text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
      selected
        ? "border-primary bg-primary/8 text-foreground"
        : "border-transparent bg-secondary/75 text-muted-foreground hover:bg-accent hover:text-foreground",
    )}
  >
    <span className="flex items-center justify-between gap-2">
      <Globe aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="font-mono text-[10px] text-emerald-700 tabular-nums dark:text-emerald-300">
        {item.latency}
      </span>
    </span>
    <span className="truncate">{item.label}</span>
  </button>
);

export const StepProfile = ({
  workspace,
  region,
  onWorkspaceChange,
  onRegionChange,
}: {
  workspace: string;
  region: string;
  onWorkspaceChange: (next: string) => void;
  onRegionChange: (next: string) => void;
}) => {
  const inputId = useId();
  return (
    <div className="flex flex-col gap-4">
      <p className="m-0 text-sm font-semibold text-foreground">工作区基础信息</p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-xs font-medium text-foreground">
          工作区名称
        </label>
        <input
          id={inputId}
          value={workspace}
          onChange={(event) => onWorkspaceChange(event.target.value)}
          placeholder="例如：matt-ui Studio"
          className="h-9.5 max-w-md rounded-xl border border-solid border-input bg-background px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-ring focus:ring-1 focus:ring-ring focus:ring-inset"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-foreground">默认边缘部署节点</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {WIZARD_REGIONS.map((item) => (
            <RegionCard
              key={item.label}
              item={item}
              selected={region === item.label}
              onSelect={() => onRegionChange(item.label)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const StepSecurity = ({
  sso,
  audit,
  otp,
  onSsoChange,
  onAuditChange,
  onOtpChange,
}: {
  sso: boolean;
  audit: boolean;
  otp: string;
  onSsoChange: (next: boolean) => void;
  onAuditChange: (next: boolean) => void;
  onOtpChange: (next: string) => void;
}) => (
  <div className="flex flex-col gap-4">
    <p className="m-0 text-sm font-semibold text-foreground">安全与发布策略</p>
    <div className="flex flex-col gap-3.5 rounded-2xl bg-muted/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-medium text-foreground">强制企业单点登录（SSO）</p>
          <p className="m-0 text-[11px] text-muted-foreground">
            所有新加入成员需通过企业身份源认证。
          </p>
        </div>
        <StretchSwitch aria-label="强制企业单点登录" checked={sso} onCheckedChange={onSsoChange} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-medium text-foreground">自动无障碍巡检门禁</p>
          <p className="m-0 text-[11px] text-muted-foreground">
            每次 Registry 发布前自动校验双主题对比度。
          </p>
        </div>
        <StretchSwitch
          aria-label="自动无障碍巡检门禁"
          checked={audit}
          onCheckedChange={onAuditChange}
        />
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-foreground">可选：输入 4 位团队口令完成绑定</span>
      <OtpInput length={4} value={otp} onValueChange={onOtpChange} aria-label="团队安全口令" />
    </div>
  </div>
);

export const StepSummary = ({
  workspace,
  region,
  sso,
  audit,
  completed,
}: {
  workspace: string;
  region: string;
  sso: boolean;
  audit: boolean;
  completed: boolean;
}) =>
  completed ? (
    <div className="flex flex-col items-center gap-2.5 py-6 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/16 dark:text-emerald-300">
        <CheckCircle2 aria-hidden="true" className="size-6" />
      </span>
      <p className="m-0 text-base font-semibold tracking-tight text-foreground">工作区已就绪</p>
      <p className="m-0 max-w-md text-xs leading-relaxed text-muted-foreground">
        「{workspace}」已部署至 {region}，可立即通过 CLI 拉取并安装组件源码。
      </p>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <ShieldCheck aria-hidden="true" className="size-4 text-foreground" />
        <p className="m-0 text-sm font-semibold text-foreground">确认并启动工作区</p>
      </div>
      <div className="grid grid-cols-1 gap-3 rounded-2xl bg-muted/55 p-4 text-xs sm:grid-cols-3">
        <div>
          <p className="m-0 text-muted-foreground">工作区名称</p>
          <p className="m-0 mt-1 font-medium text-foreground">{workspace || "matt-ui Studio"}</p>
        </div>
        <div>
          <p className="m-0 text-muted-foreground">默认节点</p>
          <p className="m-0 mt-1 font-medium text-foreground">{region}</p>
        </div>
        <div>
          <p className="m-0 text-muted-foreground">安全与门禁</p>
          <p className="m-0 mt-1 font-medium text-foreground">
            {sso ? "已开启 SSO 强制校验" : "标准邮箱登录"}
            {audit ? " · A11y 巡检" : ""}
          </p>
        </div>
      </div>
    </div>
  );
