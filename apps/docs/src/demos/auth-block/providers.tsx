"use client";

import { AuthBlock } from "@matt-ui/ui";
import { Fingerprint, Globe } from "lucide-react";
import { useState } from "react";

const PROVIDERS = [
  { id: "passkey", label: "Passkey 通行密钥", icon: <Fingerprint className="size-3.5" /> },
  { id: "saml", label: "企业 SAML SSO", icon: <Globe className="size-3.5" /> },
];

export default function AuthBlockProvidersDemo() {
  const [error, setError] = useState<string | undefined>(
    "凭据校验未通过，请确认邮箱域名已加入组织白名单。",
  );
  const [notice, setNotice] = useState("");

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <AuthBlock
        variant="subtle"
        compact
        brandName="Linear Cloud"
        ssoProviders={PROVIDERS}
        showForgotPassword
        error={error}
        onSsoClick={(id) => {
          setError(undefined);
          setNotice(`已选择身份验证通道：${id}`);
        }}
        onForgotPassword={() => setNotice("已触发安全找回流程")}
        onSubmit={({ email }) => {
          setError(undefined);
          setNotice(`校验通过：${email}`);
        }}
      />
      {notice && <span className="font-mono text-xs text-muted-foreground">{notice}</span>}
    </div>
  );
}
