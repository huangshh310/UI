// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * OnboardingWizardBlock：由 StretchSwitch、OtpInput 与 NumberFlow 组合的三步工作区初始化引导区块。
 */

import { NumberFlow } from "@/components/ui/number-flow";
import { OtpInput } from "@/components/ui/otp-input";
import { StretchSwitch } from "@/components/ui/stretch-switch";
import { cn } from "@/lib/utils";
import { Check, CheckCircle2, Globe, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useId, useState } from "react";

export interface WizardStepMeta {
  id: number;
  title: string;
  hint: string;
}

export interface WizardRegionOption {
  label: string;
  latency: string;
}

export const WIZARD_STEPS: WizardStepMeta[] = [
  { id: 0, title: "基础信息", hint: "命名与默认区域" },
  { id: 1, title: "安全策略", hint: "SSO 与动态口令" },
  { id: 2, title: "确认启动", hint: "核对配置并完成" },
];

export const WIZARD_REGIONS: WizardRegionOption[] = [
  { label: "东京（ap-northeast-1）", latency: "18ms" },
  { label: "新加坡（ap-southeast-1）", latency: "32ms" },
  { label: "法兰克福（eu-central-1）", latency: "96ms" },
];

export const WIZARD_SURFACE_CLASS: Record<OnboardingWizardVariant, string> = {
  card: "rounded-3xl border border-solid border-border bg-card p-6 shadow-xs",
  embedded: "rounded-2xl bg-card p-5 shadow-none",
  elevated: "rounded-3xl border border-solid border-border bg-card p-6 shadow-md",
};
export type OnboardingWizardVariant = "card" | "embedded" | "elevated";

export interface OnboardingResult {
  workspace: string;
  region: string;
  sso: boolean;
}

export interface OnboardingWizardBlockProps {
  /** 向导主标题 */
  title?: string;
  /** 向导副标题 */
  description?: string;
  /** 容器视觉变体 */
  variant?: OnboardingWizardVariant;
  /** 默认工作区名称 */
  defaultWorkspace?: string;
  /** 是否允许点击已完成步骤直接回跳 */
  allowStepJump?: boolean;
  /** 完成全部引导步骤后的回调 */
  onComplete?: (result: OnboardingResult) => void;
  /** 自定义类名 */
  className?: string;
}
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

const StepHeader = (p: StepHeaderProps) => (
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

const StepSummary = ({
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
  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
    <button
      type="button"
      disabled={step === 0 && !completed}
      onClick={onBack}
      className="inline-flex h-8.5 cursor-pointer items-center rounded-xl bg-secondary px-3.5 font-sans text-xs font-medium text-secondary-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
    >
      {completed ? "重新配置" : "上一步"}
    </button>
    <div className="flex items-center gap-3">
      {!completed && (
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          第 {step + 1} / {WIZARD_STEPS.length} 步
        </span>
      )}
      {!completed && (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex h-9 cursor-pointer items-center rounded-full bg-primary px-4 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-[background-color,transform] outline-none hover:bg-primary/92 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:scale-[0.98]"
        >
          {step === WIZARD_STEPS.length - 1 ? "完成初始化" : "下一步"}
        </button>
      )}
    </div>
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
  <AnimatePresence mode="wait" initial={false}>
    <motion.div
      key={panelKey}
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

interface WizardFormState {
  workspace: string;
  region: string;
  sso: boolean;
  audit: boolean;
  otp: string;
}

const createInitialForm = (defaultWorkspace: string): WizardFormState => ({
  workspace: defaultWorkspace,
  region: WIZARD_REGIONS[0]?.label ?? "东京（ap-northeast-1）",
  sso: true,
  audit: true,
  otp: "",
});

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
      audit={form.audit}
      completed={completed}
    />
  );
};

export const OnboardingWizardBlock = ({
  title = "初始化你的团队工作区",
  description = "按步骤完成基础信息、访问安全与 Registry 同步配置。",
  variant = "card",
  defaultWorkspace = "matt-ui Studio",
  allowStepJump = true,
  onComplete,
  className,
}: OnboardingWizardBlockProps) => {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [form, setForm] = useState<WizardFormState>(() => createInitialForm(defaultWorkspace));

  const patch = (next: Partial<WizardFormState>) => setForm((prev) => ({ ...prev, ...next }));
  const pct = completed ? 100 : Math.round(((step + 1) / WIZARD_STEPS.length) * 100);
  const handleNext = () => {
    if (step < WIZARD_STEPS.length - 1) return setStep((s) => s + 1);
    setCompleted(true);
    onComplete?.({ workspace: form.workspace, region: form.region, sso: form.sso });
  };
  const handleBack = () => (completed ? (setCompleted(false), setStep(0)) : setStep((s) => s - 1));

  return (
    <div
      data-slot="onboarding-wizard-block"
      data-variant={variant}
      className={cn(
        "flex w-full max-w-4xl flex-col gap-5",
        WIZARD_SURFACE_CLASS[variant],
        className,
      )}
    >
      <StepHeader
        title={title}
        description={description}
        step={completed ? WIZARD_STEPS.length : step}
        pct={pct}
        reduced={reduced}
        allowStepJump={allowStepJump}
        completed={completed}
        onSelectStep={setStep}
      />
      <StepMotionPanel panelKey={completed ? "done" : step} reduced={reduced}>
        <StepBody step={step} form={form} completed={completed} patch={patch} />
      </StepMotionPanel>
      <WizardFooter step={step} completed={completed} onBack={handleBack} onNext={handleNext} />
    </div>
  );
};
