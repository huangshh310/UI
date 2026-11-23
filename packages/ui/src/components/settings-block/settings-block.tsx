"use client";

/**
 * SettingsBlock：组合 Card、SpringSelect、DrawCheckbox、AvatarStack 与 Button 的分节设置区块。
 */
import { cn } from "@matt-ui/utils";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card/index.js";
import { Separator } from "../separator/index.js";
import {
  CollaboratorsSection,
  NotificationRows,
  RegionSection,
  SettingsFooter,
} from "./settings-block-parts.js";
import type { SettingsBlockProps, WorkspaceSettingsState } from "./settings-block.types.js";
import { settingsCardVariants } from "./settings-block.variants.js";

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
