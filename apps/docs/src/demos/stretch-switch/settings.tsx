"use client";

/**
 * 示例：工作区偏好设置列表，组合 row 变体、图标、徽章与组织策略锁定禁用态。
 */
import { StretchSwitch } from "@matt-ui/motion";
import { Globe, Lock, Sparkles } from "lucide-react";
import { useState } from "react";

export default function StretchSwitchSettingsDemo() {
  const [aiSuggest, setAiSuggest] = useState(true);
  const [edgeCache, setEdgeCache] = useState(false);

  return (
    <div className="flex w-full max-w-md flex-col divide-y divide-border/70 rounded-2xl border border-solid border-border bg-card px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="py-1.5">
        <StretchSwitch
          variant="row"
          tone="signal"
          icon={<Sparkles className="size-4" />}
          label="AI 智能补全建议"
          description="输入代码或文档时实时预测下一句内容"
          badge="Beta"
          checked={aiSuggest}
          onCheckedChange={setAiSuggest}
        />
      </div>
      <div className="py-1.5">
        <StretchSwitch
          variant="row"
          tone="success"
          icon={<Globe className="size-4" />}
          label="边缘节点缓存预热"
          description="发布后自动向亚太与欧美节点分发静态资源"
          checked={edgeCache}
          onCheckedChange={setEdgeCache}
        />
      </div>
      <div className="py-1.5">
        <StretchSwitch
          variant="row"
          icon={<Lock className="size-4" />}
          label="强制审计日志"
          description="由企业安全策略统一开启，成员无法关闭"
          badge="已锁定"
          defaultChecked
          disabled
        />
      </div>
    </div>
  );
}
