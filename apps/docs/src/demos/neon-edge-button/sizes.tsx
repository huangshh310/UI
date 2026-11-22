import { NeonEdgeButton } from "@matt-ui/ui";

export default function NeonEdgeButtonSizesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <NeonEdgeButton speed={0.6}>舒缓流光（0.6x）</NeonEdgeButton>
      <NeonEdgeButton speed={1.8}>高速流光（1.8x）</NeonEdgeButton>
      <NeonEdgeButton glow={false}>克制无外晕</NeonEdgeButton>
    </div>
  );
}
