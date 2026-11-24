"use client";

import { AiTestResults } from "@matt-ui/ui";

export default function AiTestResultsBasicDemo() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex justify-end">
        <div className="max-w-[82%] rounded-2xl bg-muted/85 px-4 py-2.5 text-[13px] text-foreground">
          跑一下测试套件，把失败的地方修好。
        </div>
      </div>

      <p className="text-[13px] leading-relaxed text-foreground/90">我先运行测试套件确认失败项。</p>

      <AiTestResults variant="seamless" />
    </div>
  );
}
