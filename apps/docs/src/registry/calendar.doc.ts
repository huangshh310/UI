/**
 * Calendar 的文档数据。
 */
import { CalendarBasic } from "@/demos/calendar/basic";
import CalendarDualMonthDemo from "@/demos/calendar/dual-month";
import CalendarRangeDemo from "@/demos/calendar/range";
import CalendarVariantsDemo from "@/demos/calendar/variants";
import type { ComponentDoc } from "./registry.types";

export const CALENDAR_DOC: ComponentDoc = {
  slug: "calendar",
  name: "Calendar",
  description:
    "零外部日期库依赖的极简月历组件，支持单日/区间选择与悬停预览、双月并排、日程打点标注、多种尺寸圆角与完整方向键导航。",
  category: "forms",
  registryName: "calendar",
  dependencies: ["class-variance-authority", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { Calendar } from "@/components/ui/calendar";

export function Demo() {
  return <Calendar mode="range" radius="full" showTodayButton />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "calendar-basic",
      name: "区间月历",
      description: "支持单日与连续区间选择、悬停区间预览、今天指示点与方向键导航。",
      file: "calendar/basic.tsx",
      Demo: CalendarBasic,
    },
    {
      slug: "variants",
      name: "圆形紧凑与日程打点",
      description: '结合 size="sm"、radius="full"、highlightDates 日程圆点与回到今天底部栏。',
      file: "calendar/variants.tsx",
      Demo: CalendarVariantsDemo,
      directory: false,
    },
    {
      slug: "dual-month",
      name: "双月跨月区间排期",
      description: "开启 numberOfMonths={2} 并排展示相邻月份，适合跨月排期与出行预订。",
      file: "calendar/dual-month.tsx",
      Demo: CalendarDualMonthDemo,
      directory: false,
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
      description: "单日模式或起止区间模式（区间模式内置悬停预览）。",
    },
    {
      name: "variant / size / radius",
      type: '"default" | "elevated" | "ghost" / "sm" | "md" | "lg" / "md" | "lg" | "full"',
      defaultValue: '"default" / "md" / "md"',
      description: "卡片表面层次、日期单元格尺寸密度与圆角风格。",
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
      name: "numberOfMonths / weekStartsOn",
      type: "1 | 2 / 0 | 1",
      defaultValue: "1 / 0",
      description: "同时展示的月数与每周起始日（0 周日 / 1 周一）。",
    },
    {
      name: "highlightDates / showTodayButton / footer",
      type: "Date[] / boolean / ReactNode",
      defaultValue: "- / false / -",
      description: "在指定日期下方标注日程圆点、底部“回到今天”快捷操作及自定义插槽。",
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
