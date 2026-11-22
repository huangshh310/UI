import OnboardingWizardBlockBasicDemo from "@/demos/onboarding-wizard-block/basic";
import OnboardingWizardBlockEmbeddedDemo from "@/demos/onboarding-wizard-block/embedded";
import type { ComponentDoc } from "./registry.types";

export const ONBOARDING_WIZARD_BLOCK_DOC: ComponentDoc = {
  slug: "onboarding-wizard-block",
  name: "Onboarding Wizard Block",
  description: "由 StretchSwitch、OtpInput 与 NumberFlow 组合的三步工作区初始化引导向导区块。",
  category: "blocks",
  registryName: "onboarding-wizard-block",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { OnboardingWizardBlock } from "@/components/ui/onboarding-wizard-block";

export function Example() {
  return <OnboardingWizardBlock />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "三步工作区引导与安全策略绑定",
      description: "依次完成命名选区、SSO 与 4 位口令绑定、摘要确认，支持步骤回退与重新配置。",
      file: "onboarding-wizard-block/basic.tsx",
      Demo: OnboardingWizardBlockBasicDemo,
    },
    {
      slug: "embedded",
      name: "紧凑内嵌容器模式",
      description: "通过 className 约束最大宽度，适合内嵌在弹窗或分栏设置页中。",
      file: "onboarding-wizard-block/embedded.tsx",
      Demo: OnboardingWizardBlockEmbeddedDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "onComplete",
      type: "(result: OnboardingResult) => void",
      defaultValue: "—",
      description: "点击完成初始化时触发",
    },
  ],
  accessibility: [
    "表单输入框、区域选择按钮、StretchSwitch 与 OtpInput 均具备完整可访问名称与焦点环。",
    "减弱动效偏好下步骤切换直接呈现内容，不阻塞键盘操作。",
  ],
};
