"use client";

import { HeroBentoBlock } from "@matt-ui/ui";
import { useState } from "react";

export default function HeroBentoBlockCenteredDemo() {
  const [action, setAction] = useState("");

  return (
    <div className="flex w-full flex-col gap-2.5">
      <HeroBentoBlock
        variant="spotlight"
        align="center"
        announcement="AI Canvas 2.4 · 品牌蓝高光版"
        headline="像搭积木一样构建精致的现代产品界面"
        subheadline="以单层发丝边界、精确间距节律与双主题无障碍对比度，让每一屏首映都具备原生质感。"
        primaryLabel="立即创建空间"
        secondaryLabel="浏览组件目录"
        socialProof="已有 18,000+ 创作者信赖"
        onPrimaryClick={() => setAction("正在初始化你的专属工作空间…")}
        onSecondaryClick={() => setAction("已跳转到组件目录")}
      />
      {action && (
        <span className="text-center font-mono text-xs text-muted-foreground">{action}</span>
      )}
    </div>
  );
}
