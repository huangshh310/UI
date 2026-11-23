"use client";

/**
 * OnboardingWizardBlock：由 StretchSwitch、OtpInput 与 NumberFlow 组合的三步工作区初始化引导区块。
 */
import { cn } from "@matt-ui/utils";
import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import {
  REGIONS,
  STEPS,
  StepHeader,
  StepProfile,
  StepSecurity,
  StepSummary,
} from "./onboarding-wizard-steps.js";
import type { OnboardingWizardBlockProps } from "./onboarding-wizard-block.types.js";

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
        className="inline-flex h-9 cursor-pointer items-center rounded-full border border-solid border-primary bg-primary px-4 font-sans text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
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
