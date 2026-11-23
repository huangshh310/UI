/**
 * 示例：ShimmerLines 首字到达前的多行流式段落占位骨架。
 */
import { ShimmerLines } from "@matt-ui/ui";

export default function ShimmerLinesDemo() {
  return (
    <div className="w-full max-w-md">
      <ShimmerLines lines={4} label="正在生成架构审阅结论…" />
    </div>
  );
}
