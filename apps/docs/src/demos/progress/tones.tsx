"use client";

import { Progress } from "@matt-ui/ui";

export default function ProgressTonesDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Progress value={42} tone="default" size="sm" label="Default · sm" showValue />
      <Progress value={68} tone="signal" size="md" label="Signal · md" showValue />
      <Progress value={100} tone="success" size="md" label="Success · md" showValue />
      <Progress value={84} tone="warning" size="lg" label="Warning · lg" showValue />
      <Progress value={94} tone="destructive" size="lg" label="Destructive · lg" showValue />
      <Progress indeterminate tone="signal" size="md" label="Indeterminate 流光加载态" />
    </div>
  );
}
