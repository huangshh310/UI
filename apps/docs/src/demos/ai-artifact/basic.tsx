"use client";

import { AiArtifact, Badge, Button } from "@matt-ui/ui";
import { Check, Cpu, Gauge, Layers, Sparkles } from "lucide-react";
import { useState } from "react";

type TierId = "pro" | "team" | "scale";

interface TierSpec {
  id: TierId;
  name: string;
  price: string;
  quota: string;
  used: string;
  percent: number;
  latency: string;
  context: string;
  cacheHit: string;
}

const TIER_MAP: Record<TierId, TierSpec> = {
  pro: {
    id: "pro",
    name: "Pro",
    price: "$29",
    quota: "2.0M",
    used: "1.42M",
    percent: 71,
    latency: "180ms",
    context: "200K",
    cacheHit: "94.2%",
  },
  team: {
    id: "team",
    name: "Team",
    price: "$89",
    quota: "10M",
    used: "4.65M",
    percent: 46,
    latency: "120ms",
    context: "500K",
    cacheHit: "96.8%",
  },
  scale: {
    id: "scale",
    name: "Scale",
    price: "$249",
    quota: "50M",
    used: "14.2M",
    percent: 28,
    latency: "75ms",
    context: "1M",
    cacheHit: "98.4%",
  },
};

const TIERS: TierSpec[] = [TIER_MAP.pro, TIER_MAP.team, TIER_MAP.scale];

const V3_CODE = `// v3: 支持实时切换档位与一键扩容的计费卡片
export function UsageQuotaCard() {
  const [tier, setTier] = useState<"pro" | "team" | "scale">("pro");
  const current = TIER_MAP[tier];

  return (
    <section className="w-full max-w-md rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">智能体推理额度</p>
          <p className="text-xs text-muted-foreground">计费周期剩余 11 天</p>
        </div>
        <TierTabs value={tier} onChange={setTier} />
      </div>
      <QuotaMeter used={current.used} quota={current.quota} percent={current.percent} />
      <MetricGrid latency={current.latency} context={current.context} hit={current.cacheHit} />
      <Button variant="primary" size="sm">确认切换至 {current.name}</Button>
    </section>
  );
}`;

const CODE_BY_VERSION: Record<string, string> = {
  v1: `// v1: 极简 AI 额度概览卡
export function UsageQuotaCard() {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <Badge variant="signal">Pro</Badge>
        <span className="font-mono text-xs text-muted-foreground">71% 已用</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">1.42M / 2.0M</p>
      <div className="mt-3 h-2 rounded-full bg-muted">
        <div className="h-full w-[71%] rounded-full bg-foreground" />
      </div>
    </section>
  );
}`,
  v2: `// v2: 补全实时推理指标三栏
export function UsageQuotaCard() {
  const metrics = [
    { label: "P50 延迟", value: "180ms" },
    { label: "上下文窗口", value: "200K" },
    { label: "缓存命中", value: "94.2%" },
  ];

  return (
    <section className="rounded-xl border bg-card p-5 shadow-xs">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold">AI 推理额度</span>
        <Badge variant="signal">Pro · $29/月</Badge>
      </header>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg border bg-muted/40 p-2.5">
            <span className="text-[11px] text-muted-foreground">{m.label}</span>
            <p className="mt-1 font-mono text-xs font-semibold">{m.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}`,
  v3: V3_CODE,
};

const QuotaProgress = ({
  used,
  quota,
  percent,
}: {
  used: string;
  quota: string;
  percent: number;
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-baseline justify-between gap-2">
      <div className="flex items-baseline gap-1.5 font-mono tabular-nums">
        <span className="text-xl font-semibold tracking-tight text-foreground">{used}</span>
        <span className="text-xs text-muted-foreground">/ {quota} Tokens</span>
      </div>
      <span className="font-mono text-xs font-medium text-foreground/80 tabular-nums">
        {percent}%
      </span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-foreground transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

const MetricGrid = ({ spec }: { spec: TierSpec }) => (
  <div className="grid grid-cols-3 gap-2">
    {[
      { label: "P50 延迟", value: spec.latency, Icon: Gauge },
      { label: "上下文", value: spec.context, Icon: Layers },
      { label: "缓存命中", value: spec.cacheHit, Icon: Cpu },
    ].map(({ label, value, Icon }) => (
      <div
        key={label}
        className="rounded-lg border border-solid border-border/75 bg-muted/30 p-2.5 dark:border-white/10 dark:bg-white/[0.03]"
      >
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Icon aria-hidden="true" className="size-3 shrink-0" />
          <span>{label}</span>
        </div>
        <p className="m-0 mt-1 font-mono text-xs font-semibold text-foreground tabular-nums">
          {value}
        </p>
      </div>
    ))}
  </div>
);

const TierSwitcher = ({ value, onChange }: { value: TierId; onChange: (id: TierId) => void }) => (
  <div className="inline-flex rounded-lg border border-solid border-border/75 bg-muted/60 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
    {TIERS.map((item) => {
      const active = item.id === value;
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={
            active
              ? "cursor-pointer rounded-md bg-card px-2.5 py-1 text-[11px] font-medium text-foreground shadow-2xs transition-colors dark:bg-white/12"
              : "cursor-pointer rounded-md bg-transparent px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {item.name}
        </button>
      );
    })}
  </div>
);

const QuotaPreviewCard = ({ version }: { version: string }) => {
  const [tier, setTier] = useState<TierId>("pro");
  const [confirmed, setConfirmed] = useState(false);
  const spec = TIER_MAP[tier];

  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-solid border-border bg-card p-5 shadow-sm dark:border-white/10">
      <div className="flex flex-wrap items-start justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles aria-hidden="true" className="size-3.5 text-foreground/80" />
            <p className="m-0 text-sm font-semibold tracking-tight text-foreground">
              智能体推理额度
            </p>
          </div>
          <p className="m-0 mt-0.5 text-xs text-muted-foreground">
            {version === "v1" ? "当前套餐实时用量" : "计费周期剩余 11 天 · 自动缓存加速"}
          </p>
        </div>
        {version === "v3" ? (
          <TierSwitcher
            value={tier}
            onChange={(next) => {
              setTier(next);
              setConfirmed(false);
            }}
          />
        ) : (
          <Badge variant="signal" shape="tag">
            {spec.name} · {spec.price}/月
          </Badge>
        )}
      </div>
      <QuotaProgress used={spec.used} quota={spec.quota} percent={spec.percent} />
      {version !== "v1" && <MetricGrid spec={spec} />}
      {version === "v3" && (
        <div className="flex items-center justify-between gap-3 border-t border-solid border-border/75 pt-3.5 dark:border-white/10">
          <div className="font-mono tabular-nums">
            <span className="text-base font-semibold text-foreground">{spec.price}</span>
            <span className="text-xs text-muted-foreground"> / 月</span>
          </div>
          <Button size="sm" variant="primary" onClick={() => setConfirmed(true)}>
            {confirmed && <Check aria-hidden="true" className="size-3.5" />}
            <span>{confirmed ? `已切换至 ${spec.name}` : `升级至 ${spec.name}`}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default function AiArtifactBasicDemo() {
  const [version, setVersion] = useState("v3");
  const [downloaded, setDownloaded] = useState(false);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2">
      <AiArtifact
        title="UsageQuotaCard.tsx"
        versions={["v1", "v2", "v3"]}
        previewSurface="grid"
        code={CODE_BY_VERSION[version] ?? V3_CODE}
        preview={<QuotaPreviewCard version={version} />}
        onVersionChange={(ver) => {
          setVersion(ver);
          setDownloaded(false);
        }}
        onDownload={() => setDownloaded(true)}
      />
      {downloaded && (
        <p className="m-0 text-right font-mono text-[11px] text-muted-foreground">
          已触发导出 UsageQuotaCard.tsx（{version}）
        </p>
      )}
    </div>
  );
}
