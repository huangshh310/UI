"use client";

/**
 * 示例：AdvancedDataTable 的极简斑马纹变体、默认隐藏列、破坏性批量操作与骨架切换。
 */
import {
  AdvancedDataTable,
  Button,
  type AdvancedTableColumn,
  type AdvancedTableFacet,
} from "@matt-ui/ui";
import { useState } from "react";

interface ApiKeyRow {
  id: string;
  name: string;
  env: "production" | "staging";
  prefix: string;
  lastUsed: string;
  requests: number;
}

const KEYS: ApiKeyRow[] = [
  {
    id: "k1",
    name: "Web 生产网关",
    env: "production",
    prefix: "mk_live_9a2f",
    lastUsed: "2 分钟前",
    requests: 18420,
  },
  {
    id: "k2",
    name: "CI 自动发布",
    env: "production",
    prefix: "mk_live_3c8e",
    lastUsed: "1 小时前",
    requests: 4120,
  },
  {
    id: "k3",
    name: "预发预览环境",
    env: "staging",
    prefix: "mk_test_7d1b",
    lastUsed: "昨天",
    requests: 890,
  },
  {
    id: "k4",
    name: "本地调试令牌",
    env: "staging",
    prefix: "mk_test_1e5c",
    lastUsed: "3 天前",
    requests: 145,
  },
];

const COLS: AdvancedTableColumn<ApiKeyRow>[] = [
  { id: "name", header: "密钥名称", accessor: (r) => r.name, sortable: true, hideable: false },
  {
    id: "prefix",
    header: "前缀",
    accessor: (r) => r.prefix,
    cell: (r) => <code className="font-mono text-xs">{r.prefix}…</code>,
  },
  { id: "env", header: "环境", accessor: (r) => r.env },
  { id: "lastUsed", header: "最近使用", accessor: (r) => r.lastUsed, defaultHidden: true },
  {
    id: "requests",
    header: "24h 调用",
    accessor: (r) => r.requests,
    sortable: true,
    align: "right",
  },
];

const FACETS: AdvancedTableFacet<ApiKeyRow>[] = [
  {
    id: "env",
    label: "环境",
    getValue: (r) => r.env,
    options: [
      { value: "production", label: "生产" },
      { value: "staging", label: "预发" },
    ],
  },
];

export default function AdvancedDataTableVariantsDemo() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2">
      <AdvancedDataTable
        title="API 密钥管理（Minimal + Striped）"
        description="默认隐藏“最近使用”列，可通过列显隐毛玻璃弹层按需开启"
        variant="minimal"
        striped
        loading={loading}
        data={KEYS}
        columns={COLS}
        getRowId={(r) => r.id}
        facets={FACETS}
        onRowClick={(row) => setLog(`正在检查密钥：${row.name}（${row.prefix}）`)}
        batchActions={[
          {
            id: "revoke",
            label: "吊销所选密钥",
            tone: "destructive",
            onAction: (rows) => setLog(`已模拟吊销 ${rows.length} 个密钥`),
          },
        ]}
        toolbarActions={
          <Button variant="secondary" size="sm" onClick={() => setLoading((v) => !v)}>
            {loading ? "结束加载" : "骨架预览"}
          </Button>
        }
      />
      {log && <p className="m-0 px-1 font-mono text-xs text-muted-foreground">{log}</p>}
    </div>
  );
}
