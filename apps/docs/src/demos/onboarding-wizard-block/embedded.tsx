"use client";

import { OnboardingWizardBlock } from "@matt-ui/motion";

export default function OnboardingWizardBlockEmbeddedDemo() {
  return (
    <OnboardingWizardBlock
      variant="embedded"
      title="快速创建子工作区"
      description="扁平发丝边框与低阴影表面，适合内嵌在弹窗或设置分栏。"
      defaultWorkspace="Design Systems Lab"
      className="max-w-3xl"
    />
  );
}
