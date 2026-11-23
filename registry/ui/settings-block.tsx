// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SettingsBlock：组合 Card、SpringSelect、DrawCheckbox、AvatarStack 与 Button 的分节设置区块。
 */

import { AvatarStack } from "@/components/ui/avatar-stack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DrawCheckbox } from "@/components/ui/draw-checkbox";
import { Separator } from "@/components/ui/separator";
import { SpringSelect, type SpringSelectOption } from "@/components/ui/spring-select";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { BellRing, Check, Globe, RotateCcw, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const SETTINGS_REGION_OPTIONS: SpringSelectOption[] = [
  {
    value: "ap-northeast-1",
    label: "东京（ap-northeast-1）",
    description: "亚太低延迟首选边缘节点",
    badge: "14ms",
    dot: "success",
  },
  {
    value: "ap-southeast-1",
    label: "新加坡（ap-southeast-1）",
    description: "东南亚跨区均衡节点",
    badge: "19ms",
    dot: "success",
  },
  {
    value: "eu-central-1",
    label: "法兰克福（eu-central-1）",
    description: "欧洲合规与 GDPR 数据驻留",
    badge: "28ms",
    dot: "signal",
  },
];

export const SETTINGS_MEMBERS = [
  { id: "1", name: "林知远", role: "管理员", initials: "林", status: "online" as const },
  { id: "2", name: "周宁", role: "架构师", initials: "周", status: "online" as const },
  { id: "3", name: "陈屿", role: "设计师", initials: "陈" },
  { id: "4", name: "许澄", role: "测试", initials: "许" },
  { id: "5", name: "陆川", role: "开发", initials: "陆" },
];

export const settingsCardVariants = cva("w-full max-w-3xl border border-solid", {
  variants: {
    variant: {
      default: "border-border/80 bg-card shadow-xs dark:border-white/10",
      elevated:
        "border-border/80 bg-card shadow-lg dark:border-white/12 dark:shadow-[0_18px_40px_rgba(0,0,0,0.42)]",
      sectioned:
        "border-border/80 bg-secondary/35 shadow-none dark:border-white/10 dark:bg-background/80",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const settingsSectionVariants = cva("transition-colors", {
  variants: {
    variant: {
      default: "",
      elevated: "",
      sectioned:
        "rounded-2xl border border-solid border-border/80 bg-card shadow-xs dark:border-white/10",
    },
    compact: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { variant: "sectioned", compact: false, class: "p-4" },
    { variant: "sectioned", compact: true, class: "p-3" },
  ],
  defaultVariants: {
    variant: "default",
    compact: false,
  },
});
export type SettingsBlockVariant = "default" | "elevated" | "sectioned";

export interface WorkspaceSettingsState {
  region: string;
  releaseAlert: boolean;
  auditAlert: boolean;
}

export interface SettingsBlockProps {
  /** 面板视觉风格：标准发丝单卡、浮层阴影或分节卡片组 */
  variant?: SettingsBlockVariant;
  /** 面板标题 */
  title?: string;
  /** 面板副标题描述 */
  description?: string;
  /** 默认部署区域 */
  defaultRegion?: string;
  /** 默认发布状态告警开关 */
  defaultReleaseAlert?: boolean;
  /** 默认无障碍回归巡检开关 */
  defaultAuditAlert?: boolean;
  /** 紧凑密度模式 */
  compact?: boolean;
  /** 保存回调 */
  onSave?: (state: WorkspaceSettingsState) => void;
  /** 重置回调 */
  onReset?: () => void;
  /** 自定义容器类名 */
  className?: string;
}
const RegionSection = ({
  region,
  variant,
  compact,
  onChange,
}: {
  region: string;
  variant: SettingsBlockVariant;
  compact: boolean;
  onChange: (next: string) => void;
}) => (
  <div
    className={cn(
      "grid grid-cols-1 items-center gap-3 sm:grid-cols-3",
      settingsSectionVariants({ variant, compact }),
    )}
  >
    <div>
      <p className="m-0 text-sm font-medium tracking-[-0.01em] text-foreground">默认部署区域</p>
      <p className="m-0 mt-0.5 text-xs text-muted-foreground">用于新建边缘函数与静态站点。</p>
    </div>
    <div className="sm:col-span-2">
      <SpringSelect
        label="部署区域"
        size={compact ? "sm" : "md"}
        prefix={<Globe aria-hidden="true" className="size-4" />}
        options={SETTINGS_REGION_OPTIONS}
        value={region}
        onValueChange={(next) => next && onChange(next)}
      />
    </div>
  </div>
);

const CollaboratorsSection = ({
  variant,
  compact,
}: {
  variant: SettingsBlockVariant;
  compact: boolean;
}) => {
  const onlineCount = SETTINGS_MEMBERS.filter((m) => "status" in m && m.status === "online").length;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        settingsSectionVariants({ variant, compact }),
      )}
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="m-0 text-sm font-medium tracking-[-0.01em] text-foreground">协作成员</p>
          <Badge variant="success" size="sm" dot>
            {onlineCount} 人在线
          </Badge>
        </div>
        <p className="m-0 mt-0.5 text-xs text-muted-foreground">
          当前共 {SETTINGS_MEMBERS.length} 位拥有发布权限的成员。
        </p>
      </div>
      <AvatarStack items={SETTINGS_MEMBERS} max={4} size="sm" />
    </div>
  );
};

const NotificationRows = ({
  releaseAlert,
  auditAlert,
  variant,
  compact,
  onReleaseChange,
  onAuditChange,
}: {
  releaseAlert: boolean;
  auditAlert: boolean;
  variant: SettingsBlockVariant;
  compact: boolean;
  onReleaseChange: (next: boolean) => void;
  onAuditChange: (next: boolean) => void;
}) => {
  const itemVariant = variant === "sectioned" ? "card" : "tile";
  return (
    <div className={cn("flex flex-col", compact ? "gap-1.5" : "gap-2.5")}>
      <div className="px-1">
        <p className="m-0 text-xs font-medium tracking-[-0.01em] text-muted-foreground">
          通知与质量门禁
        </p>
      </div>
      <DrawCheckbox
        variant={itemVariant}
        controlPosition="right"
        size={compact ? "sm" : "md"}
        icon={<BellRing aria-hidden="true" className="size-4" />}
        label="发布状态告警"
        description="生产构建失败或回滚时第一时间通知。"
        checked={releaseAlert}
        onCheckedChange={onReleaseChange}
      />
      <DrawCheckbox
        variant={itemVariant}
        controlPosition="right"
        size={compact ? "sm" : "md"}
        icon={<ShieldCheck aria-hidden="true" className="size-4" />}
        label="无障碍回归巡检"
        description="每日构建后自动发送双主题 axe 对比度摘要。"
        checked={auditAlert}
        onCheckedChange={onAuditChange}
      />
    </div>
  );
};

const SettingsFooter = ({
  dirty,
  saved,
  onReset,
  onSave,
}: {
  dirty: boolean;
  saved: boolean;
  onReset: () => void;
  onSave: () => void;
}) => (
  <CardFooter muted className="flex-wrap gap-3 border-border/80 dark:border-white/10">
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      {dirty ? (
        <>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
          <span>有未保存的更改</span>
        </>
      ) : saved ? (
        <>
          <Check aria-hidden="true" className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>设置已保存</span>
        </>
      ) : (
        <span>更改将在保存后立即生效</span>
      )}
    </span>
    <div className="flex items-center gap-2">
      {dirty && (
        <Button size="sm" variant="ghost" radius="pill" onClick={onReset}>
          <RotateCcw aria-hidden="true" className="size-3.5" />
          <span>重置</span>
        </Button>
      )}
      <Button size="sm" variant="primary" radius="pill" onClick={onSave}>
        保存设置
      </Button>
    </div>
  </CardFooter>
);
const isSameSettings = (a: WorkspaceSettingsState, b: WorkspaceSettingsState) =>
  a.region === b.region && a.releaseAlert === b.releaseAlert && a.auditAlert === b.auditAlert;

const resolveSettingsConfig = (props: SettingsBlockProps) => ({
  variant: props.variant ?? "default",
  title: props.title ?? "工作区偏好设置",
  description: props.description ?? "统一配置部署默认区域、成员权限与构建通知策略。",
  compact: props.compact ?? false,
  initial: {
    region: props.defaultRegion ?? "ap-northeast-1",
    releaseAlert: props.defaultReleaseAlert ?? true,
    auditAlert: props.defaultAuditAlert ?? true,
  },
});

const SettingsBody = ({
  draft,
  variant,
  compact,
  onUpdate,
}: {
  draft: WorkspaceSettingsState;
  variant: SettingsBlockProps["variant"];
  compact: boolean;
  onUpdate: (patch: Partial<WorkspaceSettingsState>) => void;
}) => {
  const resolvedVariant = variant ?? "default";
  const isSectioned = resolvedVariant === "sectioned";

  return (
    <CardContent className={cn("flex flex-col", compact ? "gap-3.5 px-5 py-2.5" : "gap-5")}>
      <RegionSection
        region={draft.region}
        variant={resolvedVariant}
        compact={compact}
        onChange={(region) => onUpdate({ region })}
      />
      {!isSectioned && <Separator />}
      <CollaboratorsSection variant={resolvedVariant} compact={compact} />
      {!isSectioned && <Separator />}
      <NotificationRows
        releaseAlert={draft.releaseAlert}
        auditAlert={draft.auditAlert}
        variant={resolvedVariant}
        compact={compact}
        onReleaseChange={(releaseAlert) => onUpdate({ releaseAlert })}
        onAuditChange={(auditAlert) => onUpdate({ auditAlert })}
      />
    </CardContent>
  );
};

export const SettingsBlock = (props: SettingsBlockProps) => {
  const cfg = resolveSettingsConfig(props);
  const [draft, setDraft] = useState<WorkspaceSettingsState>(cfg.initial);
  const [committed, setCommitted] = useState<WorkspaceSettingsState>(cfg.initial);
  const [saved, setSaved] = useState(false);

  return (
    <Card
      data-slot="settings-block"
      data-variant={cfg.variant}
      className={cn(settingsCardVariants({ variant: cfg.variant }), props.className)}
    >
      <CardHeader className={cn(cfg.compact && "px-5 pt-5 pb-2")}>
        <CardTitle>{cfg.title}</CardTitle>
        <CardDescription>{cfg.description}</CardDescription>
      </CardHeader>
      <SettingsBody
        draft={draft}
        variant={cfg.variant}
        compact={cfg.compact}
        onUpdate={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
      />
      <SettingsFooter
        dirty={!isSameSettings(draft, committed)}
        saved={saved}
        onReset={() => {
          setDraft(committed);
          props.onReset?.();
        }}
        onSave={() => {
          setCommitted(draft);
          setSaved(true);
          props.onSave?.(draft);
        }}
      />
    </Card>
  );
};
