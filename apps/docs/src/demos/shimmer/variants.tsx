/**
 * 示例：Shimmer 扫掠速度、色调与胶囊变体矩阵。
 */
import { Shimmer, ShimmerLines } from "@matt-ui/ui";

export default function ShimmerVariantsDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Shimmer variant="pill" size="xs" tone="muted" speed="slow">
          思考规划中…
        </Shimmer>
        <Shimmer variant="pill" size="xs" tone="foreground" speed="normal">
          检索向量索引…
        </Shimmer>
        <Shimmer variant="pill" size="xs" tone="signal" speed="fast">
          执行工具校验…
        </Shimmer>
      </div>
      <div className="flex flex-col gap-2">
        <Shimmer as="p" size="sm" tone="muted" className="m-0">
          正在整理关键变更摘要与风险清单…
        </Shimmer>
        <ShimmerLines lines={3} size="sm" tone="subtle" label="正在补全段落细节…" />
      </div>
    </div>
  );
}
