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
  dependencies: ["lucide-react", "clsx", "tailwind-merge"],
  usage: `import { BookCallButton } from "@/components/ui/book-call-button";

export function Demo() {
  return <BookCallButton label="Book a call" onClick={() => console.log("book")} />;
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
      description: "通过 label 属性定制团队评审与架构咨询预约按钮。",
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
  ],
  accessibility: [
    "文字滑出只是视觉效果，可访问名称始终是 label。",
    "键盘聚焦与鼠标悬停触发同样的展开效果。",
  ],
};
