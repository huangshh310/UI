/**
 * SettingsBlock 的样式变体与默认区域/成员配置。
 */
import { cva } from "class-variance-authority";
import type { SpringSelectOption } from "../spring-select/index.js";

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
