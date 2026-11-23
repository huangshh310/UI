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
      description:
        "依次完成命名选区、SSO 与 4 位口令绑定、摘要确认，配备顶部弹性进度条、步骤回跳与重新配置。",
      file: "onboarding-wizard-block/basic.tsx",
      Demo: OnboardingWizardBlockBasicDemo,
    },
    {
      slug: "embedded",
      name: "紧凑内嵌容器模式",
      description: '通过 variant="embedded" 与 className 约束宽度，适合内嵌在弹窗或分栏设置页中。',
      file: "onboarding-wizard-block/embedded.tsx",
      Demo: OnboardingWizardBlockEmbeddedDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "title",
      type: "string",
      defaultValue: '"初始化你的团队工作区"',
      description: "向导主标题",
    },
    {
      name: "description",
      type: "string",
      defaultValue: '"按步骤完成基础信息、访问安全与 Registry 同步配置。"',
      description: "向导副标题说明",
    },
    {
      name: "variant",
      type: '"card" | "embedded" | "elevated"',
      defaultValue: '"card"',
      description: "容器表面与投影变体",
    },
    {
      name: "defaultWorkspace",
      type: "string",
      defaultValue: '"matt-ui Studio"',
      description: "工作区名称初始值",
    },
    {
      name: "allowStepJump",
      type: "boolean",
      defaultValue: "true",
      description: "是否允许点击已完成步骤直接回跳",
    },
    {
      name: "onComplete",
      type: "(result: OnboardingResult) => void",
      defaultValue: "—",
      description: "点击完成初始化时触发",
    },
  ],
  accessibility: [
    "步骤指示器为当前激活步声明 aria-current=step，区域卡片暴露 aria-pressed 状态。",
    "表单输入框、区域选择按钮、StretchSwitch 与 OtpInput 均具备完整可访问名称与单层焦点环。",
    "减弱动效偏好下步骤切换与顶部进度条均直接更新，不阻塞键盘操作。",
  ],
};
