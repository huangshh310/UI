"use client";

import { AdvancedDataTable, Badge, type AdvancedTableColumn } from "@matt-ui/ui";

interface AuditRow {
  id: string;
  route: string;
  theme: "浅色" | "深色";
  violations: number;
  duration: string;
}

const AUDIT_ROWS: AuditRow[] = [
  { id: "1", route: "/components/sheet", theme: "浅色", violations: 0, duration: "1.1s" },
  { id: "2", route: "/components/sheet", theme: "深色", violations: 0, duration: "1.2s" },
  {
    id: "3",
    route: "/components/team-members-block",
    theme: "浅色",
    violations: 0,
    duration: "1.4s",
  },
  {
    id: "4",
    route: "/components/team-members-block",
    theme: "深色",
    violations: 0,
    duration: "1.3s",
  },
];

const AUDIT_COLS: AdvancedTableColumn<AuditRow>[] = [
  { id: "route", header: "路由", accessor: (r) => r.route, sortable: true, hideable: false },
  { id: "theme", header: "主题", accessor: (r) => r.theme },
  {
    id: "violations",
    header: "axe 违规",
    accessor: (r) => r.violations,
    cell: (r) => (
      <Badge variant="success" dot>
        {r.violations} 违规
      </Badge>
    ),
  },
  { id: "duration", header: "耗时", accessor: (r) => r.duration, align: "right" },
];

export default function AdvancedDataTableAuditDemo() {
  return (
    <div className="w-full max-w-3xl">
      <AdvancedDataTable
        title="无障碍巡检报告"
        description="默认紧凑密度展示最近一次 Playwright axe 巡检记录"
        data={AUDIT_ROWS}
        columns={AUDIT_COLS}
        getRowId={(r) => r.id}
        defaultDensity="compact"
        facets={[
          {
            id: "theme",
            label: "主题",
            getValue: (r) => r.theme,
            options: [
              { value: "浅色", label: "浅色" },
              { value: "深色", label: "深色" },
            ],
          },
        ]}
      />
    </div>
  );
}
