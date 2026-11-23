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
