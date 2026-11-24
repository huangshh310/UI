"use client";

import { AiApprovalCard } from "@matt-ui/ui";

export default function AiApprovalCardBasicDemo() {
  return (
    <AiApprovalCard
      className="w-full max-w-xl"
      title="授权执行 Registry 发布校验"
      agentName="Core Agent · Bash"
      workingDir="~/work/UI"
    />
  );
}
