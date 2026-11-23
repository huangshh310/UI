"use client";

import { MorphingDialog } from "@matt-ui/motion";
import { Cpu, ShieldCheck } from "lucide-react";

export default function MorphingDialogGalleryDemo() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
      <MorphingDialog
        size="sm"
        tag="EDGE"
        tagTone="signal"
        icon={<Cpu className="size-3.5" />}
        title="推理路由引擎"
        subtitle="按延迟自动择优调度"
        meta="99.98% SLA"
        triggerClassName="max-w-none"
      >
        多区域推理节点实时探测 TTFB，异常时在 120ms 内自动完成无感降级切换。
      </MorphingDialog>
      <MorphingDialog
        size="sm"
        tag="AUDIT"
        tagTone="warning"
        icon={<ShieldCheck className="size-3.5" />}
        title="合规巡检报告"
        subtitle="每周自动生成审计快照"
        meta="2 项建议待处理"
        triggerClassName="max-w-none"
      >
        已核验密钥轮换周期、最小权限策略与访问日志留存天数，点击即可导出 PDF 归档。
      </MorphingDialog>
    </div>
  );
}
