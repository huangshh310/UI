"use client";

/**
 * SettingsBlock 内部设置分节：区域选择、协作成员、通知开关与底部保存栏。
 */
import { cn } from "@matt-ui/utils";
import { BellRing, Check, Globe, RotateCcw, ShieldCheck } from "lucide-react";
import { AvatarStack } from "../avatar-stack/index.js";
import { Badge } from "../badge/index.js";
import { Button } from "../button/index.js";
import { CardFooter } from "../card/index.js";
import { DrawCheckbox } from "../draw-checkbox/index.js";
import { SpringSelect } from "../spring-select/index.js";
import type { SettingsBlockVariant } from "./settings-block.types.js";
import {
  SETTINGS_MEMBERS,
  SETTINGS_REGION_OPTIONS,
  settingsSectionVariants,
} from "./settings-block.variants.js";

export const RegionSection = ({
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

export const CollaboratorsSection = ({
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

export const NotificationRows = ({
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

export const SettingsFooter = ({
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
