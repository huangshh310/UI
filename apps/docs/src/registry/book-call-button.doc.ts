/**
 * BookCallButton 的文档数据。
 */
import { BookCallButtonBasic } from "@/demos/book-call-button/basic";
import BookCallButtonCustomDemo from "@/demos/book-call-button/custom";
import type { ComponentDoc } from "./registry.types";

export const BOOK_CALL_BUTTON_DOC: ComponentDoc = {
  slug: "book-call-button",
  name: "Book Call Button",
  description: "预约通话的胶囊按钮：悬停时信号色胶囊铺满按钮，浮现电话图标。",
  category: "buttons",
  registryName: "book-call-button",
  dependencies: ["class-variance-authority", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { BookCallButton } from "@/components/ui/book-call-button";

export function Demo() {
  return (
    <BookCallButton
      variant="outline"
      tone="signal"
      label="Book a call"
      hoverLabel="15 min"
      onClick={() => console.log("book")}
    />
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "book-call-button-basic",
      name: "展开的胶囊",
      description: "悬停或用键盘聚焦时展开。",
      file: "book-call-button/basic.tsx",
      Demo: BookCallButtonBasic,
    },
    {
      slug: "custom",
      name: "自定义中文预约动作文案",
      description: "通过 variant、tone、size 与自定义图标定制团队评审与架构咨询预约按钮。",
      file: "book-call-button/custom.tsx",
      Demo: BookCallButtonCustomDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "label",
      type: "string",
      defaultValue: '"Book a call"',
      description: "按钮上的文字，也是它的可访问名称。",
    },
    {
      name: "hoverLabel",
      type: "string",
      defaultValue: "-",
      description: "悬停展开时显示在居中图标旁的辅助文案（纯装饰）。",
    },
    {
      name: "variant",
      type: '"primary" | "outline" | "surface"',
      defaultValue: '"primary"',
      description: "按钮底面的视觉变体。",
    },
    {
      name: "tone",
      type: '"signal" | "emerald" | "primary"',
      defaultValue: '"signal"',
      description: "展开胶囊的语义色调。",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "按钮尺寸。",
    },
    {
      name: "leadingIcon",
      type: "ReactNode",
      defaultValue: "ArrowUpRight",
      description: "静置时左侧胶囊内的引导图标。",
    },
    {
      name: "icon",
      type: "ReactNode",
      defaultValue: "Phone",
      description: "悬停展开后居中的动作图标。",
    },
  ],
  accessibility: [
    "文字滑出只是视觉效果，可访问名称始终是 label。",
    "键盘聚焦与鼠标悬停触发同样的展开效果。",
    "用户要求减少动态效果时跳过平滑位移过渡。",
  ],
};
