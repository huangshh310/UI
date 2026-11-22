"use client";

import { SegmentedControl } from "@matt-ui/motion";

export default function SegmentedControlDensityDemo() {
  return (
    <SegmentedControl
      ariaLabel="视图布局密度"
      defaultValue="comfortable"
      items={[
        { value: "compact", label: "紧凑" },
        { value: "comfortable", label: "标准" },
        { value: "spacious", label: "宽松" },
      ]}
    />
  );
}
