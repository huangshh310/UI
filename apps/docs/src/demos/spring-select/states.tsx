"use client";

/**
 * 示例：一键清空（clearable）、错误校验态（error）与禁用态（disabled）。
 */
import { SpringSelect } from "@matt-ui/ui";
import { Coins } from "lucide-react";

const CURRENCIES = [
  { value: "cny", label: "人民币 · CNY", badge: "¥", description: "中国大陆默认结算币种" },
  { value: "usd", label: "美元 · USD", badge: "$", description: "国际卡与海外账单结算" },
  { value: "eur", label: "欧元 · EUR", badge: "€", description: "欧盟区 SEPA 结算" },
  {
    value: "jpy",
    label: "日元 · JPY",
    badge: "¥",
    description: "暂未开放自动扣款",
    disabled: true,
  },
];

export default function SpringSelectStatesDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
      <SpringSelect
        label="可一键清空"
        placeholder="选择结算币种"
        prefix={<Coins className="size-4" />}
        defaultValue="cny"
        clearable
        tone="signal"
        hint="选中后可点击右侧 × 图标快速恢复未选态"
        options={CURRENCIES}
        className="max-w-none"
      />
      <SpringSelect
        label="错误校验态"
        placeholder="请选择结算币种"
        prefix={<Coins className="size-4" />}
        error="提交账单前必须选择一种有效结算币种"
        options={CURRENCIES}
        className="max-w-none"
      />
      <SpringSelect
        label="禁用锁定态"
        defaultValue="usd"
        disabled
        hint="企业年度合约期内暂不支持更改币种"
        options={CURRENCIES}
        className="max-w-none sm:col-span-2"
      />
    </div>
  );
}
