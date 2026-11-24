"use client";

import { OnboardingWizardBlock } from "@matt-ui/motion";

export default function OnboardingWizardBlockEmbeddedDemo() {
  return (
    <OnboardingWizardBlock
      variant="embedded"
      title="快速创建子工作区"
      description="面向弹窗或分栏场景的紧凑子工作区引导。"
      defaultWorkspace="Design Systems Lab"
      className="max-w-3xl"
    />
  );
}
