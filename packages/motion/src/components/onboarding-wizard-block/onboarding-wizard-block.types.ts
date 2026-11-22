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
