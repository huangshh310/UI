// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * OnboardingWizardBlock：由 StretchSwitch、OtpInput 与 NumberFlow 组合的三步工作区初始化引导区块。
 */

import { NumberFlow } from "@/components/ui/number-flow";
import { OtpInput } from "@/components/ui/otp-input";
import { StretchSwitch } from "@/components/ui/stretch-switch";
import { cn } from "@/lib/utils";
import { Check, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useId, useState } from "react";

export interface OnboardingResult {
  workspace: string;
  region: string;
  sso: boolean;
}

export interface OnboardingWizardBlockProps {
  /** 完成全部引导步骤后的回调 */
  onComplete?: (result: OnboardingResult) => void;
  /** 自定义类名 */
  className?: string;
}
const STEPS = [
  { id: 0, title: "基础信息", hint: "命名与默认区域" },
  { id: 1, title: "安全策略", hint: "SSO 与动态口令" },
  { id: 2, title: "确认启动", hint: "核对配置并完成" },
];

const REGIONS = ["东京（ap-northeast-1）", "新加坡（ap-southeast-1）", "法兰克福（eu-central-1）"];

const StepBadgeItem = ({
  item,
  done,
  active,
}: {
  item: (typeof STEPS)[number];
  done: boolean;
  active: boolean;
}) => (
  <div
    className={cn(
      "flex items-center gap-2.5 rounded-xl border border-solid px-3 py-2.5 text-xs transition-colors",
      active
        ? "border-signal bg-signal/8 text-foreground"
        : done
          ? "border-border bg-secondary/45 text-foreground"
          : "border-border/70 bg-transparent text-muted-foreground",
    )}
  >
    <span
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold",
        active || done ? "bg-signal text-signal-foreground" : "bg-secondary text-muted-foreground",
      )}
    >
      {done ? <Check aria-hidden="true" className="size-3.5" /> : item.id + 1}
    </span>
    <div className="min-w-0">
      <p className="m-0 truncate font-medium">{item.title}</p>
      <p className="m-0 hidden truncate text-[11px] text-muted-foreground sm:block">{item.hint}</p>
    </div>
  </div>
);

const StepHeader = ({ step, pct }: { step: number; pct: number }) => (
  <div className="flex flex-col gap-4 border-b border-solid border-border/80 pb-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p className="m-0 text-base font-semibold tracking-tight text-foreground">
          初始化你的团队工作区
        </p>
        <p className="m-0 mt-0.5 text-xs text-muted-foreground">
          按步骤完成基础信息、访问安全与 Registry 同步配置。
        </p>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-solid border-border bg-secondary/50 px-3 py-1">
        <span className="text-xs text-muted-foreground">完成度</span>
        <NumberFlow value={pct} suffix="%" className="text-xs font-semibold text-foreground" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {STEPS.map((item) => (
        <StepBadgeItem key={item.id} item={item} done={step > item.id} active={step === item.id} />
      ))}
    </div>
  </div>
);

const StepProfile = ({
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
          className="h-9 max-w-md rounded-lg border border-solid border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20 dark:bg-card"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-foreground">默认边缘部署节点</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {REGIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onRegionChange(item)}
              className={cn(
                "cursor-pointer rounded-xl border border-solid px-3 py-2.5 text-left text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                region === item
                  ? "border-signal bg-signal/8 text-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground dark:bg-card",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const StepSecurity = ({
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
    <div className="flex flex-col gap-3 rounded-xl border border-solid border-border bg-secondary/35 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-medium text-foreground">强制企业单点登录（SSO）</p>
          <p className="m-0 text-[11px] text-muted-foreground">
            所有新加入成员需通过企业身份源认证。
          </p>
        </div>
        <StretchSwitch aria-label="强制企业单点登录" checked={sso} onCheckedChange={onSsoChange} />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-solid border-border/70 pt-3">
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

const StepSummary = ({
  workspace,
  region,
  sso,
  completed,
}: {
  workspace: string;
  region: string;
  sso: boolean;
  completed: boolean;
}) =>
  completed ? (
    <div className="flex flex-col items-center gap-2 py-6 text-center">
      <span className="inline-flex size-11 items-center justify-center rounded-full bg-signal text-signal-foreground">
        <CheckCircle2 aria-hidden="true" className="size-5" />
      </span>
      <p className="m-0 text-base font-semibold text-foreground">工作区已就绪</p>
      <p className="m-0 text-xs text-muted-foreground">
        「{workspace}」已部署至 {region}，可立即通过 shadcn CLI 安装组件。
      </p>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <ShieldCheck aria-hidden="true" className="size-4 text-signal" />
        <p className="m-0 text-sm font-semibold text-foreground">确认并启动工作区</p>
      </div>
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-solid border-border bg-secondary/35 p-4 text-xs sm:grid-cols-3">
        <div>
          <p className="m-0 text-muted-foreground">工作区名称</p>
          <p className="m-0 mt-1 font-medium text-foreground">{workspace || "matt-ui Studio"}</p>
        </div>
        <div>
          <p className="m-0 text-muted-foreground">默认节点</p>
          <p className="m-0 mt-1 font-medium text-foreground">{region}</p>
        </div>
        <div>
          <p className="m-0 text-muted-foreground">安全模式</p>
          <p className="m-0 mt-1 font-medium text-foreground">
            {sso ? "已开启 SSO 强制校验" : "标准邮箱登录"}
          </p>
        </div>
      </div>
    </div>
  );
const WizardFooter = ({
  step,
  completed,
  onBack,
  onNext,
}: {
  step: number;
  completed: boolean;
  onBack: () => void;
  onNext: () => void;
}) => (
  <div className="flex items-center justify-between gap-2 border-t border-solid border-border/80 pt-4">
    <button
      type="button"
      disabled={step === 0 && !completed}
      onClick={onBack}
      className="inline-flex h-8 cursor-pointer items-center rounded-lg border border-solid border-border bg-background px-3 font-sans text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40 dark:bg-card"
    >
      {completed ? "重新配置" : "上一步"}
    </button>
    {!completed && (
      <button
        type="button"
        onClick={onNext}
        className="inline-flex h-8 cursor-pointer items-center rounded-lg border border-solid border-signal bg-signal px-3.5 font-sans text-xs font-medium text-signal-foreground transition-opacity hover:opacity-92"
      >
        {step === STEPS.length - 1 ? "完成初始化" : "下一步"}
      </button>
    )}
  </div>
);

const StepMotionPanel = ({
  panelKey,
  reduced,
  children,
}: {
  panelKey: string | number;
  reduced: boolean | null;
  children: ReactNode;
}) => (
  <motion.div
    key={panelKey}
    initial={reduced ? false : { opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.16 }}
  >
    {children}
  </motion.div>
);

interface WizardFormState {
  workspace: string;
  region: string;
  sso: boolean;
  audit: boolean;
  otp: string;
}

const INITIAL_FORM: WizardFormState = {
  workspace: "matt-ui Studio",
  region: REGIONS[0] ?? "东京（ap-northeast-1）",
  sso: true,
  audit: true,
  otp: "",
};

const StepBody = ({
  step,
  form,
  completed,
  patch,
}: {
  step: number;
  form: WizardFormState;
  completed: boolean;
  patch: (next: Partial<WizardFormState>) => void;
}) => {
  if (step === 0) {
    return (
      <StepProfile
        workspace={form.workspace}
        region={form.region}
        onWorkspaceChange={(workspace) => patch({ workspace })}
        onRegionChange={(region) => patch({ region })}
      />
    );
  }
  if (step === 1) {
    return (
      <StepSecurity
        sso={form.sso}
        audit={form.audit}
        otp={form.otp}
        onSsoChange={(sso) => patch({ sso })}
        onAuditChange={(audit) => patch({ audit })}
        onOtpChange={(otp) => patch({ otp })}
      />
    );
  }
  return (
    <StepSummary
      workspace={form.workspace}
      region={form.region}
      sso={form.sso}
      completed={completed}
    />
  );
};

export const OnboardingWizardBlock = ({ onComplete, className }: OnboardingWizardBlockProps) => {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [form, setForm] = useState<WizardFormState>(INITIAL_FORM);

  const patch = (next: Partial<WizardFormState>) => setForm((prev) => ({ ...prev, ...next }));
  const pct = completed ? 100 : Math.round(((step + 1) / STEPS.length) * 100);
  const handleNext = () => {
    if (step < STEPS.length - 1) return setStep((s) => s + 1);
    setCompleted(true);
    onComplete?.({ workspace: form.workspace, region: form.region, sso: form.sso });
  };
  const handleBack = () => (completed ? (setCompleted(false), setStep(0)) : setStep((s) => s - 1));

  return (
    <div
      data-slot="onboarding-wizard-block"
      className={cn(
        "flex w-full max-w-4xl flex-col gap-5 rounded-2xl border border-solid border-border bg-card p-6 shadow-sm",
        className,
      )}
    >
      <StepHeader step={completed ? STEPS.length : step} pct={pct} />
      <StepMotionPanel panelKey={completed ? "done" : step} reduced={reduced}>
        <StepBody step={step} form={form} completed={completed} patch={patch} />
      </StepMotionPanel>
      <WizardFooter step={step} completed={completed} onBack={handleBack} onNext={handleNext} />
    </div>
  );
};
