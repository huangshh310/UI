"use client";

import { OnboardingWizardBlock } from "@matt-ui/motion";
import { useState } from "react";

export default function OnboardingWizardBlockBasicDemo() {
  const [summary, setSummary] = useState("");
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <OnboardingWizardBlock
        onComplete={({ workspace, region }) =>
          setSummary(`已完成「${workspace}」在 ${region} 的初始化`)
        }
      />
      {summary && <p className="m-0 font-mono text-xs text-muted-foreground">{summary}</p>}
    </div>
  );
}
