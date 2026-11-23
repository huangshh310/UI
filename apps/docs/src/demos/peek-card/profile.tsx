"use client";

import { PeekCard } from "@matt-ui/ui";

export default function PeekCardProfileDemo() {
  return (
    <p className="m-0 text-sm text-muted-foreground">
      该次变更由{" "}
      <PeekCard
        triggerLabel="@zhiyuan.lin"
        href="#profile-preview"
        size="sm"
        title="林知远"
        badge="MAINTAINER"
        subtitle="设计系统与交互底座架构师"
        identity={{ initials: "林", name: "林知远", meta: "上海 · UTC+8" }}
        metrics={[
          { label: "近 30 天提交", value: "64 次" },
          { label: "代码评审", value: "28 PRs" },
        ]}
        footerLeft="活跃于 4 分钟前"
        status="在线协作中"
        statusTone="signal"
      />{" "}
      审核并合并至主分支。
    </p>
  );
}
