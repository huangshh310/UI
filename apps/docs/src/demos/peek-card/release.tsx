"use client";

import { PeekCard } from "@matt-ui/ui";

export default function PeekCardReleaseDemo() {
  return (
    <p className="m-0 text-sm text-muted-foreground">
      当前生产环境运行版本为{" "}
      <PeekCard
        triggerLabel="v2.4.0-stable"
        href="#release"
        title="@matt-ui/ui v2.4.0"
        badge="LATEST"
        subtitle="悬浮留白 Sheet 与 12 个页面区块模板"
        value="PASS"
        metrics={[
          { label: "Registry 条目", value: "71 项" },
          { label: "双主题 axe", value: "0 违规" },
        ]}
        footerLeft="Node 22 · React 19"
        status="已通过全量构建"
        statusTone="success"
      />
      ，悬停或聚焦可快速查看发布指标。
    </p>
  );
}
