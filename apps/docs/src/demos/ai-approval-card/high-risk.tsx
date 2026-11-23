"use client";

import { AiApprovalCard } from "@matt-ui/ui";

export default function AiApprovalCardHighRiskDemo() {
  return (
    <AiApprovalCard
      title="生产环境 schema 变更审批"
      description="该指令将更新线上边缘存储索引，请选择回滚保护策略。"
      agentName="Deploy Agent · Production"
      workingDir="/srv/edge-db"
      impact="影响 2 张索引表 · 5 秒可回滚"
      command="pnpm db:migrate --env production"
      riskLevel="high"
      options={[
        {
          id: "snapshot",
          label: "先创建全量快照再执行迁移（推荐）",
          description: "异常时可在 5 秒内无损回滚。",
        },
        {
          id: "dryrun",
          label: "仅执行 Dry-Run 预检并输出变更报告",
          description: "不修改线上实际数据。",
        },
      ]}
    />
  );
}
