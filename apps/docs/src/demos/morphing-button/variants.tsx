"use client";

import { MorphingButton, type MorphingButtonStatus } from "@matt-ui/motion";
import { CloudUpload, Sparkles } from "lucide-react";
import { useState } from "react";

export default function MorphingButtonVariantsDemo() {
  const [deployStatus, setDeployStatus] = useState<MorphingButtonStatus>("idle");
  const [syncStatus, setSyncStatus] = useState<MorphingButtonStatus>("idle");

  const runDeploy = () => {
    setDeployStatus("loading");
    setTimeout(() => setDeployStatus("success"), 900);
    setTimeout(() => setDeployStatus("idle"), 2600);
  };

  const runSync = () => {
    setSyncStatus("loading");
    setTimeout(() => setSyncStatus("success"), 900);
    setTimeout(() => setSyncStatus("idle"), 2600);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <MorphingButton
        status={deployStatus}
        variant="signal"
        successTone="emerald"
        idleIcon={<CloudUpload />}
        labels={{ idle: "发布至边缘节点", loading: "构建中…", success: "已上线" }}
        onClick={runDeploy}
      />
      <MorphingButton
        status={syncStatus}
        variant="outline"
        size="sm"
        radius="default"
        successTone="emerald"
        idleIcon={<Sparkles />}
        labels={{ idle: "生成摘要", loading: "推理中…", success: "已完成" }}
        onClick={runSync}
      />
    </div>
  );
}
