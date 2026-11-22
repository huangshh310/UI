/**
 * 带动效的按钮组件的 Stories：每个组件一个，用于开发时逐个检查。
 */
import {
  BookCallButton,
  LiquidRippleButton,
  NeonEdgeButton,
  PressButton,
  SplitButton,
  TypewriterButton,
} from "@matt-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Animated Buttons",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Press: Story = {
  render: () => <PressButton>Press and hold</PressButton>,
};

export const LiquidRipple: Story = {
  render: () => <LiquidRippleButton>Click anywhere</LiquidRippleButton>,
};

export const NeonEdge: Story = {
  render: () => <NeonEdgeButton>Deploy preview</NeonEdgeButton>,
};

export const BookCall: Story = {
  render: () => <BookCallButton />,
};

export const Typewriter: Story = {
  render: () => <TypewriterButton label="Deploy to production" />,
};

export const Split: Story = {
  render: () => (
    <SplitButton
      actions={[
        { id: "draft", label: "Save as draft", onSelect: () => {} },
        { id: "publish", label: "Save and publish", onSelect: () => {} },
      ]}
    >
      Save
    </SplitButton>
  ),
};
