import SegmentedControlBasicDemo from "@/demos/segmented-control/basic";
import SegmentedControlDensityDemo from "@/demos/segmented-control/density";
import SegmentedControlVariantsDemo from "@/demos/segmented-control/variants";
import type { ComponentDoc } from "./registry.types";

export const SEGMENTED_CONTROL_DOC: ComponentDoc = {
  slug: "segmented-control",
  name: "Segmented Control",
  description:
    "内凹轨道配物理抬升弹簧滑块的分段控制器，支持 default / glass / signal 质感、三档尺寸、图标与方向键切换。",
  category: "navigation",
  registryName: "segmented-control",
  dependencies: ["motion"],
  createdAt: "2026-11-22",
  usage: `import { SegmentedControl } from "@/components/ui/segmented-control";

export function Example() {
  return (
    <SegmentedControl
      variant="signal"
      size="md"
      items={[
        { value: "chat", label: "对话" },
        { value: "voice", label: "语音" },
      ]}
    />
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "物理抬升滑块与徽章分段器",
      description: "采用 layoutId 弹簧物理驱动激活滑块，在内凹轨道内呈现真实的 C 端卡片层次。",
      file: "segmented-control/basic.tsx",
      Demo: SegmentedControlBasicDemo,
    },
    {
      slug: "variants",
      name: "磨砂玻璃、信号蓝与图标分段器",
      description: "展示 glass 与 signal 两种质感变体、sm/md 尺寸、图标搭配及禁用项跳过。",
      file: "segmented-control/variants.tsx",
      Demo: SegmentedControlVariantsDemo,
      directory: false,
    },
    {
      slug: "density",
      name: "三档视图密度切换器",
      description: "非受控模式下用于快速切换列表或画布的紧凑/标准/宽松密度。",
      file: "segmented-control/density.tsx",
      Demo: SegmentedControlDensityDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "items",
      type: "SegmentedControlItem[]",
      defaultValue: "必填",
      description: "分段项列表，支持 icon、badge 与 disabled",
    },
    {
      name: "variant",
      type: '"default" | "glass" | "signal"',
      defaultValue: '"default"',
      description: "视觉质感：默认凹槽、磨砂玻璃或信号蓝实底",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "控件高度与字号规格",
    },
    {
      name: "fullWidth",
      type: "boolean",
      defaultValue: "false",
      description: "是否撑满容器宽度等分排布",
    },
    { name: "value", type: "string", defaultValue: "—", description: "受控当前值" },
    {
      name: "defaultValue",
      type: "string",
      defaultValue: "首项 value",
      description: "非受控初始值",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      defaultValue: "—",
      description: "切换回调",
    },
    {
      name: "ariaLabel",
      type: "string",
      defaultValue: '"分段切换器"',
      description: "外层控件无障碍名称",
    },
  ],
  accessibility: [
    "外层使用语义化 <fieldset>，内部按钮声明 aria-pressed 并支持左右方向键、Home / End 切换（自动跳过禁用项）且同步移动键盘焦点。",
  ],
};
