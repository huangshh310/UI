"use client";

/**
 * 示例：校验成功态、错误提示态、字母数字混合与禁用态。
 */
import { OtpInput } from "@matt-ui/motion";

export default function OtpInputStatesDemo() {
  return (
    <div className="flex flex-col gap-6">
      <OtpInput
        label="校验通过态（Success）"
        variant="grouped"
        length={6}
        separatorAt={3}
        status="success"
        defaultValue="802419"
        hint="身份验证已通过"
      />
      <OtpInput
        label="校验失败态（Error）"
        variant="default"
        length={6}
        separatorAt={3}
        defaultValue="1102"
        error="安全码错误或已过期，请重新输入"
      />
      <OtpInput
        label="字母数字邀请码（Alphanumeric）"
        variant="grouped"
        length={6}
        separatorAt={3}
        validationType="alphanumeric"
        defaultValue="M2K"
        hint="允许输入大小写字母与数字"
      />
    </div>
  );
}
