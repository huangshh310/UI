/**
 * OTP Input 的文档数据。
 */
import { OtpInputBasic } from "@/demos/otp-input/basic";
import OtpInputPinDemo from "@/demos/otp-input/pin";
import OtpInputStatesDemo from "@/demos/otp-input/states";
import OtpInputVariantsDemo from "@/demos/otp-input/variants";
import type { ComponentDoc } from "./registry.types";

export const OTP_INPUT_DOC: ComponentDoc = {
  slug: "otp-input",
  name: "OTP Input",
  description:
    "基于 Base UI OTPField 与 motion 的一次性验证码输入，支持连体分组、柔灰填充与极简下划线四种风格、自动推进、整段粘贴与落位弹跳反馈。",
  category: "forms",
  registryName: "otp-input",
  dependencies: ["@base-ui/react", "motion", "clsx", "tailwind-merge"],
  usage: `import { OtpInput } from "@/components/ui/otp-input";

export function Demo() {
  return (
    <OtpInput
      label="验证码"
      variant="grouped"
      length={6}
      separatorAt={3}
      onComplete={verify}
    />
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "otp-input-basic",
      name: "6 位连体验证码输入",
      description: "自动过滤非数字字符、自动推进焦点并支持一次性粘贴完整安全码，填满后呈现成功态。",
      file: "otp-input/basic.tsx",
      Demo: OtpInputBasic,
    },
    {
      slug: "variants",
      name: "四种视觉风格与尺寸",
      description: "展示 default、grouped 连体分组、filled 柔灰填充与 underline 下划线风格。",
      file: "otp-input/variants.tsx",
      Demo: OtpInputVariantsDemo,
      directory: false,
    },
    {
      slug: "pin",
      name: "4 位掩码 PIN 安全输入",
      description: "通过 length={4}、filled 风格与 mask 属性隐藏明文字符，适合支付与敏感操作校验。",
      file: "otp-input/pin.tsx",
      Demo: OtpInputPinDemo,
      directory: false,
    },
    {
      slug: "states",
      name: "成功、错误与字母数字校验态",
      description: "展示 status 反馈、error 错误提示（aria-invalid）与字母数字混合模式。",
      file: "otp-input/states.tsx",
      Demo: OtpInputStatesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant / size",
      type: `"default" | "grouped" | "filled" | "underline" / "sm" | "md" | "lg"`,
      defaultValue: `"default" / "md"`,
      description: "槽位视觉形态（含 shadcn 风格连体分组）与三档尺寸。",
    },
    { name: "length", type: "number", defaultValue: "6", description: "验证码输入位数。" },
    {
      name: "separatorAt / separator",
      type: "number / ReactNode",
      defaultValue: "-",
      description: "在第几位前插入分隔符（如 3）以及自定义分隔符节点。",
    },
    {
      name: "status / invalid",
      type: `"default" | "success" | "error" / boolean`,
      defaultValue: `"default" / false`,
      description: "验证成功或失败的视觉状态反馈。",
    },
    {
      name: "label / hint / error",
      type: "string",
      defaultValue: "-",
      description: "标签、下方辅助提示与错误校验文案（传入 error 自动设置 aria-invalid）。",
    },
    {
      name: "validationType / mask",
      type: `"numeric" | "alpha" | "alphanumeric" | "none" / boolean`,
      defaultValue: `"numeric" / false`,
      description: "允许输入的字符类型及是否掩码显示。",
    },
    {
      name: "value / defaultValue / onComplete",
      type: "string / (value: string) => void",
      defaultValue: `""`,
      description: "受控或非受控验证码，以及全部位填满时的回调。",
    },
  ],
  accessibility: [
    '首位槽位原生绑定 label，其余槽位声明独立序数标签，自动支持 autocomplete="one-time-code"。',
    "支持左右方向键移动、Backspace 退格删除以及整段粘贴分发；传入 error 时通过 aria-invalid 与 alert 播报。",
    "用户要求减少动态效果时跳过槽位弹出缩放动画。",
  ],
};
