"use client";

import { SplitButton } from "@matt-ui/ui";

const SAMPLE_ACTIONS = [
  { id: "copy", label: "复制链接", shortcut: "⌘C", onSelect: () => undefined },
  { id: "export", label: "导出为 JSON", shortcut: "⌘E", onSelect: () => undefined },
];

export default function SplitButtonVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <SplitButton variant="primary" radius="default" actions={SAMPLE_ACTIONS}>
        合并请求
      </SplitButton>
      <SplitButton variant="outline" radius="default" actions={SAMPLE_ACTIONS}>
        导出数据
      </SplitButton>
      <SplitButton variant="secondary" size="sm" actions={SAMPLE_ACTIONS}>
        批量归档
      </SplitButton>
      <SplitButton variant="destructive" size="sm" actions={SAMPLE_ACTIONS}>
        删除分支
      </SplitButton>
    </div>
  );
}
