import { NeonEdgeButton } from "@matt-ui/ui";

export default function NeonEdgeButtonSizesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <NeonEdgeButton size="sm" speed={0.8}>
        紧凑尺寸
      </NeonEdgeButton>
      <NeonEdgeButton size="md" speed={1.2}>
        标准流光
      </NeonEdgeButton>
      <NeonEdgeButton size="lg" speed={1.6}>
        主视觉大号
      </NeonEdgeButton>
    </div>
  );
}
