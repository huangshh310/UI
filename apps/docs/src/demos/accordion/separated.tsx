"use client";

import { Accordion } from "@matt-ui/ui";
import { KeyRound, Shield, Zap } from "lucide-react";

export default function AccordionSeparatedDemo() {
  return (
    <div className="w-full max-w-md">
      <Accordion
        variant="separated"
        indicator="plus"
        defaultValue={["edge"]}
        items={[
          {
            value: "edge",
            title: "边缘节点自动路由",
            subtitle: "全球 35 个区域低延迟调度",
            icon: <Zap className="size-3.5" />,
            badge: "默认开启",
            content:
              "根据客户端地理位置自动选择最近节点，并在健康检查异常时 200ms 内完成故障切换。",
          },
          {
            value: "sso",
            title: "企业单点登录与 SAML 2.0",
            subtitle: "支持 Okta、Azure AD 与飞书身份源",
            icon: <KeyRound className="size-3.5" />,
            content: "管理员可在工作区设置中绑定自定义域名并强制成员通过 SSO 登录。",
          },
          {
            value: "audit",
            title: "细粒度审计日志",
            subtitle: "保留 180 天只读操作轨迹",
            icon: <Shield className="size-3.5" />,
            content: "支持导出 JSONL 与实时推送至 SIEM 平台，满足 SOC 2 合规审计要求。",
          },
        ]}
      />
    </div>
  );
}
