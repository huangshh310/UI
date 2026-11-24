import type { OnboardingWizardVariant } from "./onboarding-wizard-block.types.js";

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
