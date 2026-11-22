/**
 * OTP Input 的文档数据。
 */
import { OtpInputBasic } from "@/demos/otp-input/basic";
import OtpInputPinDemo from "@/demos/otp-input/pin";
import type { ComponentDoc } from "./registry.types";

export const OTP_INPUT_DOC: ComponentDoc = {
  slug: "otp-input",
  name: "OTP Input",
  description:
    "基于 Base UI OTPField 与 motion 的一次性验证码输入，支持自动前进、整段粘贴与落位弹跳反馈。",
  category: "forms",
  registryName: "otp-input",
  dependencies: ["@base-ui/react", "motion", "clsx", "tailwind-merge"],
  usage: `import { OtpInput } from "@/components/ui/otp-input";

export function Demo() {
  return <OtpInput label="验证码" length={6} separatorAt={3} onComplete={verify} />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "otp-input-basic",
      name: "6 位验证码输入",
      description: "自动过滤非数字字符、自动推进焦点并支持一次性粘贴完整安全码。",
      file: "otp-input/basic.tsx",
      Demo: OtpInputBasic,
    },
    {
      slug: "pin",
      name: "4 位掩码 PIN 安全输入",
      description: "通过 length={4} 与 mask 属性隐藏明文字符，适合支付与敏感操作校验。",
      file: "otp-input/pin.tsx",
      Demo: OtpInputPinDemo,
      directory: false,
    },
  ],
  api: [
    { name: "length", type: "number", defaultValue: "6", description: "验证码输入位数。" },
    {
      name: "separatorAt",
      type: "number",
      defaultValue: "-",
      description: "在第几位前插入分隔横线（如 3）。",
    },
    {
      name: "validationType",
      type: `"numeric" | "alpha" | "alphanumeric" | "none"`,
      defaultValue: `"numeric"`,
      description: "允许输入的字符类型。",
    },
    {
      name: "mask",
      type: "boolean",
      defaultValue: "false",
      description: "是否以密码掩码形式显示已填字符。",
    },
    {
      name: "value / defaultValue",
      type: "string",
      defaultValue: `""`,
      description: "受控或非受控验证码。",
    },
    {
      name: "onComplete",
      type: "(value: string) => void",
      defaultValue: "-",
      description: "全部位填满时触发。",
    },
  ],
  accessibility: [
    '首位槽位原生绑定 label，其余槽位声明独立序数标签，自动支持 autocomplete="one-time-code"。',
    "支持左右方向键移动、Backspace 退格删除以及整段粘贴分发。",
    "用户要求减少动态效果时跳过槽位弹出缩放动画。",
  ],
};
