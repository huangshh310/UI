/**
 * TriggerMenu、TokenInput、Waterfall 与 ColorPicker 的 Storybook 用例。
 */
import { ColorPicker, PromptInput, TokenInput, TriggerMenu, Waterfall } from "@matt-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Agent & Color Controls",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const PromptWithTriggerMenu: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <TriggerMenu
        triggers={[
          {
            char: "@",
            groupLabel: "工作区文件",
            items: [
              { value: "src/index.ts", label: "index.ts", badge: "TS" },
              { value: "src/styles.css", label: "styles.css", badge: "CSS" },
            ],
          },
          {
            char: "/",
            boundary: "start",
            groupLabel: "快捷指令",
            items: [{ value: "review", label: "review", description: "审阅当前提交改动" }],
          },
        ]}
      >
        <PromptInput aria-label="智能体对话输入" />
      </TriggerMenu>
    </div>
  ),
};

export const ContextTokenEditor: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <TokenInput
        label="上下文提示词"
        defaultValue={[
          "对比分析 ",
          { type: "file", value: "src/index.ts", label: "index.ts", tone: "signal" },
          " 的公开导出契约",
        ]}
        triggers={[
          {
            char: "@",
            type: "file",
            items: [{ value: "README.md", label: "README.md", badge: "MD" }],
          },
        ]}
      />
    </div>
  ),
};

export const AgentTraceWaterfall: Story = {
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <Waterfall
        title="本轮调用耗时追踪"
        showControls
        metaHeader="负载"
        defaultExpanded={["root"]}
        milestones={[{ time: 520, label: "首帧 TTFT" }]}
        items={[
          {
            value: "root",
            label: "智能体任务主循环",
            start: 0,
            duration: 820,
            tone: "signal",
            meta: "1.9k tok",
            children: [
              {
                value: "search",
                label: "文档检索",
                start: 20,
                duration: 220,
                tone: "success",
                meta: "4 命中",
              },
              {
                value: "synth",
                label: "响应流式生成",
                start: 500,
                duration: 320,
                tone: "signal",
                meta: "流式",
              },
            ],
          },
        ]}
      />
    </div>
  ),
};

export const MultiSpaceColorPicker: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <ColorPicker
        label="品牌信号色"
        defaultValue="#2563eb"
        presets={["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]}
      />
      <ColorPicker
        label="感知均匀色盘"
        space="oklch"
        defaultValue="oklch(0.62 0.19 259)"
        showAlpha
        showChannelInputs
      />
    </div>
  ),
};
