"use client";

/**
 * 示例：AiSurfaceAgent 将带检索特征的表格自动升权为 DataTable，将组合框字段升权为可搜索 Combobox。
 */
import { AiSurfaceAgent, type AiSurfaceAgentProps } from "@matt-ui/ui";
import { useState } from "react";

const UPGRADE_SCHEMA: NonNullable<AiSurfaceAgentProps["schema"]> = {
  properties: {
    zone: {
      type: "string",
      title: "调度可用区",
      default: "ap-east-1",
      oneOf: [
        { value: "ap-east-1", label: "亚太东一区", description: "低延迟主集群" },
        { value: "ap-south-1", label: "亚太南一区", description: "灾备热备集群" },
        { value: "eu-central-1", label: "欧洲中一区", description: "合规独立集群" },
      ],
    },
  },
};

const UPGRADE_VIEW: NonNullable<AiSurfaceAgentProps["uischema"]> = {
  main: [
    {
      kind: "control",
      scope: "#/properties/zone",
      controlType: "combobox",
      placeholder: "搜索目标可用区…",
    },
    {
      kind: "table",
      title: "在线工作节点",
      description: "声明 searchable 或 sortable 后自动由 rank 5 DataTable 接管渲染",
      searchable: true,
      rowActionId: "inspect-worker",
      columns: [
        { key: "host", header: "主机标识", cellKind: "mono", sortable: true },
        { key: "load", header: "负载水位", cellKind: "meter" },
        { key: "status", header: "状态", cellKind: "badge" },
      ],
      rows: [
        { id: "w1", host: "worker-ap-01", load: 42, status: "Healthy" },
        { id: "w2", host: "worker-ap-02", load: 78, status: "Busy" },
        { id: "w3", host: "worker-eu-01", load: 31, status: "Healthy" },
      ],
    },
  ],
};

export const AiSurfaceAgentDataUpgrade = () => {
  const [zone, setZone] = useState("ap-east-1");
  const [pickedHost, setPickedHost] = useState("未选择节点");

  return (
    <div className="flex w-full flex-col gap-2.5">
      <AiSurfaceAgent
        schema={UPGRADE_SCHEMA}
        uischema={UPGRADE_VIEW}
        onDataChange={(next) => setZone(String(next.zone ?? ""))}
        onAction={(ev) => {
          if (ev.payload?.host) setPickedHost(String(ev.payload.host));
        }}
      />
      <p className="m-0 font-mono text-xs text-muted-foreground">
        {`当前可用区：${zone || "未选"} · 最近点击节点：${pickedHost}`}
      </p>
    </div>
  );
};

export default AiSurfaceAgentDataUpgrade;
