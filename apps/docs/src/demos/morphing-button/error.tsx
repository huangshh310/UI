"use client";

import { MorphingButton, type MorphingButtonStatus } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function MorphingButtonErrorDemo() {
  const [status, setStatus] = useState<MorphingButtonStatus>("idle");

  return (
    <div className="flex flex-col items-center gap-3">
      <MorphingButton
        status={status}
        variant="outline"
        radius="default"
        idleIcon={<ShieldCheck />}
        labels={{
          idle: "提交生产审核",
          loading: "校验中…",
          success: "已通过",
          error: "校验失败，点此重试",
        }}
        onClick={() => {
          setStatus("loading");
          setTimeout(() => setStatus("error"), 900);
        }}
      />
      <Button size="sm" variant="ghost" onClick={() => setStatus("idle")}>
        重置为空闲态
      </Button>
    </div>
  );
}
