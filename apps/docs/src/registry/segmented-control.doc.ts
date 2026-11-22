import SegmentedControlBasicDemo from "@/demos/segmented-control/basic";
import SegmentedControlDensityDemo from "@/demos/segmented-control/density";
import type { ComponentDoc } from "./registry.types";

export const SEGMENTED_CONTROL_DOC: ComponentDoc = {
  slug: "segmented-control",
  name: "Segmented Control",
  description: "内凹轨道配物理抬升弹簧滑块的分段控制器，支持键盘左右方向键切换与徽章提示。",
  category: "navigation",
  registryName: "segmented-control",
  dependencies: ["motion"],
  createdAt: "2026-11-22",
  usage: `import { SegmentedControl } from "@/components/ui/segmented-control";

export function Example() {
  return (
    <SegmentedControl
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
      description: "分段项列表",
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
    "外层使用语义化 <fieldset>，内部按钮声明 aria-pressed 并支持左右方向键、Home / End 切换且同步移动键盘焦点。",
  ],
};
