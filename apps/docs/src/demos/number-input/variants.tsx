"use client";

import { NumberInput } from "@matt-ui/ui";

export default function NumberInputVariantsDemo() {
  return (
    <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2">
      <NumberInput
        label="右侧堆叠步进（stepper）"
        variant="stepper"
        size="md"
        defaultValue={120}
        step={10}
        suffix="ms"
      />
      <NumberInput
        label="填充风格（filled + sm）"
        variant="filled"
        size="sm"
        defaultValue={99}
        prefix="¥"
      />
      <NumberInput
        label="大尺寸配额（lg）"
        size="lg"
        defaultValue={16}
        min={1}
        max={128}
        suffix="GB"
        hint="按步长 1 GB 调整显存限额"
      />
      <NumberInput
        label="校验态示例"
        variant="stepper"
        defaultValue={2}
        min={1}
        max={100}
        suffix="台"
        error="生产集群至少需要 3 个节点"
      />
    </div>
  );
}
