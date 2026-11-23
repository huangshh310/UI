import { PressButton } from "@matt-ui/ui";

export default function PressButtonVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <PressButton variant="signal" pressStrength={0.04}>
        发布生产版本
      </PressButton>
      <PressButton variant="secondary" pressStrength={0.05}>
        保存草稿
      </PressButton>
      <PressButton variant="outline" elevation="flat" pressStrength={0.04}>
        平面描边
      </PressButton>
      <PressButton variant="destructive" pressStrength={0.06}>
        回滚快照
      </PressButton>
    </div>
  );
}
