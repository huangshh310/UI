/**
 * Calendar 的文档数据。
 */
import { CalendarBasic } from "@/demos/calendar/basic";
import CalendarRangeDemo from "@/demos/calendar/range";
import type { ComponentDoc } from "./registry.types";

export const CALENDAR_DOC: ComponentDoc = {
  slug: "calendar",
  name: "Calendar",
  description:
    "零外部日期库依赖的月历组件，支持单日/区间选择、双月并排、禁用约束与完整方向键导航。",
  category: "forms",
  registryName: "calendar",
  dependencies: ["lucide-react", "clsx", "tailwind-merge"],
  usage: `import { Calendar } from "@/components/ui/calendar";

export function Demo() {
  return <Calendar mode="range" />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "calendar-basic",
      name: "区间月历",
      description: "支持单日与连续区间选择、今天钴蓝指示点与方向键导航。",
      file: "calendar/basic.tsx",
      Demo: CalendarBasic,
    },
    {
      slug: "range",
      name: "工作日区间选择与周末禁用",
      description: '开启 mode="range" 与 isDateDisabled 过滤周末，清晰呈现起止区间高亮。',
      file: "calendar/range.tsx",
      Demo: CalendarRangeDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "mode",
      type: '"single" | "range"',
      defaultValue: '"single"',
      description: "单日模式或起止区间模式。",
    },
    {
      name: "value / defaultValue",
      type: "Date | null",
      defaultValue: "-",
      description: "单日模式下的受控与非受控值。",
    },
    {
      name: "range / defaultRange",
      type: "{ start: Date | null; end: Date | null }",
      defaultValue: "-",
      description: "区间模式下的受控与非受控值。",
    },
    {
      name: "numberOfMonths",
      type: "1 | 2",
      defaultValue: "1",
      description: "同时展示的月数，适合区间并排选择。",
    },
    {
      name: "minDate / maxDate / isDateDisabled",
      type: "Date / (date: Date) => boolean",
      defaultValue: "-",
      description: "日期可选边界与自定义禁用逻辑。",
    },
  ],
  accessibility: [
    '每个日期按钮提供完整的本地化年月日 aria-label 与 aria-pressed 状态，今天标记 aria-current="date"。',
    "支持方向键移动日期、Home/End 跳至周首尾、PageUp/PageDown 跨月导航，焦点随跨月自动同步。",
    "禁用日期原生 disabled，键盘与指针均不可误选。",
  ],
};
