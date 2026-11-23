import { NeonEdgeButton } from "@matt-ui/ui";

export default function NeonEdgeButtonVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <NeonEdgeButton variant="surface" tone="signal">
        卡片表面
      </NeonEdgeButton>
      <NeonEdgeButton variant="primary" tone="emerald">
        翡翠流光
      </NeonEdgeButton>
      <NeonEdgeButton variant="surface" tone="violet" radius="default">
        圆角紫光
      </NeonEdgeButton>
      <NeonEdgeButton variant="primary" tone="amber" glow={false}>
        克制无外晕
      </NeonEdgeButton>
    </div>
  );
}
