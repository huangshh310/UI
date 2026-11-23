/**
 * 示例：ShimmerLines 首字到达前的多行流式段落占位骨架。
 */
import { ShimmerLines } from "@matt-ui/ui";

export default function ShimmerLinesDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <ShimmerLines lines={4} variant="card" label="正在生成架构审阅结论…" />
    </div>
  );
}
