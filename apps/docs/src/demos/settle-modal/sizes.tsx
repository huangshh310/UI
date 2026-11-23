"use client";

import { Button, SettleModal, type SettleModalSize } from "@matt-ui/ui";
import { Layers } from "lucide-react";
import { useState } from "react";

const SIZES: { size: SettleModalSize; label: string; desc: string }[] = [
  { size: "sm", label: "sm 紧凑", desc: "适合短确认提示与二次验证。" },
  { size: "md", label: "md 标准", desc: "默认宽度，覆盖绝大多数表单与信息弹窗。" },
  { size: "lg", label: "lg 宽幅", desc: "适合包含多栏对比、配置摘要的内容弹层。" },
  { size: "xl", label: "xl 大屏", desc: "适合预览明细、日志或复杂向导，搭配顶部对齐。" },
];

export default function SettleModalSizesDemo() {
  const [active, setActive] = useState<(typeof SIZES)[number] | null>(null);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {SIZES.map((item) => (
        <Button key={item.size} variant="outline" size="sm" onClick={() => setActive(item)}>
          {item.label}
        </Button>
      ))}
      <SettleModal
        open={active !== null}
        onOpenChange={(next) => !next && setActive(null)}
        size={active?.size ?? "md"}
        align={active?.size === "xl" ? "top" : "center"}
        icon={<Layers className="size-4" />}
        title={`宽度规格：${active?.label ?? ""}`}
        description={active?.desc}
        footer={
          <Button size="sm" variant="signal" onClick={() => setActive(null)}>
            关闭预览
          </Button>
        }
      >
        <p className="m-0 text-xs leading-relaxed text-muted-foreground">
          支持 sm / md / lg / xl 四种宽度规格，以及居中（center）或顶部偏移（top）两种对齐方式。
        </p>
      </SettleModal>
    </div>
  );
}
