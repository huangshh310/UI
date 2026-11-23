// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SettingsBlock：组合 Card、SpringSelect、DrawCheckbox、AvatarStack 与 Button 的分节设置区块。
 */

import { AvatarStack } from "@/components/ui/avatar-stack";
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
import { SpringSelect } from "@/components/ui/spring-select";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface WorkspaceSettingsState {
  region: string;
  releaseAlert: boolean;
  auditAlert: boolean;
}

export interface SettingsBlockProps {
  /** 保存回调 */
  onSave?: (state: WorkspaceSettingsState) => void;
  /** 自定义容器类名 */
  className?: string;
}
const REGIONS = [
  { value: "ap-northeast-1", label: "东京（ap-northeast-1）" },
  { value: "ap-southeast-1", label: "新加坡（ap-southeast-1）" },
  { value: "eu-central-1", label: "法兰克福（eu-central-1）" },
];

const MEMBERS = [
  { id: "1", name: "林知远", role: "管理员", initials: "林", status: "online" as const },
  { id: "2", name: "周宁", role: "架构师", initials: "周", status: "online" as const },
  { id: "3", name: "陈屿", role: "设计师", initials: "陈" },
  { id: "4", name: "许澄", role: "测试", initials: "许" },
  { id: "5", name: "陆川", role: "开发", initials: "陆" },
];

const NotificationRows = ({
  releaseAlert,
  auditAlert,
  onReleaseChange,
  onAuditChange,
}: {
  releaseAlert: boolean;
  auditAlert: boolean;
  onReleaseChange: (next: boolean) => void;
  onAuditChange: (next: boolean) => void;
}) => (
  <div className="flex flex-col gap-3">
    <DrawCheckbox
      label="发布状态告警"
      description="生产构建失败或回滚时第一时间通知。"
      checked={releaseAlert}
      onCheckedChange={onReleaseChange}
    />
    <DrawCheckbox
      label="无障碍回归巡检"
      description="每日构建后自动发送双主题 axe 对比度摘要。"
      checked={auditAlert}
      onCheckedChange={onAuditChange}
    />
  </div>
);

const RegionSection = ({
  region,
  onChange,
}: {
  region: string;
  onChange: (next: string) => void;
}) => (
  <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-3">
    <div>
      <p className="m-0 text-sm font-medium text-foreground">默认部署区域</p>
      <p className="m-0 text-xs text-muted-foreground">用于新建边缘函数与静态站点。</p>
    </div>
    <div className="sm:col-span-2">
      <SpringSelect
        label="部署区域"
        options={REGIONS}
        value={region}
        onValueChange={(next) => next && onChange(next)}
      />
    </div>
  </div>
);

export const SettingsBlock = ({ onSave, className }: SettingsBlockProps) => {
  const [region, setRegion] = useState("ap-northeast-1");
  const [releaseAlert, setReleaseAlert] = useState(true);
  const [auditAlert, setAuditAlert] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <Card data-slot="settings-block" className={cn("w-full max-w-3xl", className)}>
      <CardHeader>
        <CardTitle>工作区偏好设置</CardTitle>
        <CardDescription>统一配置部署默认区域、成员权限与构建通知策略。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <RegionSection region={region} onChange={setRegion} />
        <Separator />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="m-0 text-sm font-medium text-foreground">协作成员</p>
            <p className="m-0 text-xs text-muted-foreground">当前共 5 位拥有发布权限的成员。</p>
          </div>
          <AvatarStack items={MEMBERS} max={4} size="sm" />
        </div>
        <Separator />
        <NotificationRows
          releaseAlert={releaseAlert}
          auditAlert={auditAlert}
          onReleaseChange={setReleaseAlert}
          onAuditChange={setAuditAlert}
        />
      </CardContent>
      <CardFooter muted>
        <span className="text-xs text-muted-foreground">
          {saved ? "设置已保存" : "更改将在保存后立即生效"}
        </span>
        <Button
          size="sm"
          variant="primary"
          className="rounded-full"
          onClick={() => {
            setSaved(true);
            onSave?.({ region, releaseAlert, auditAlert });
          }}
        >
          保存设置
        </Button>
      </CardFooter>
    </Card>
  );
};
