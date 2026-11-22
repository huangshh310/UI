/**
 * @matt-ui/motion 组件的 Stories：覆盖磁吸、变形、拖动确认与液滴开关。
 * 用工具栏的 Theme 在浅色与深色之间切换。
 */
import {
  DragToConfirm,
  LiquidToggle,
  MagneticButton,
  MorphingButton,
  type MorphingButtonStatus,
} from "@matt-ui/motion";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = {
  title: "Components/Motion Buttons",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Magnetic: Story = {
  render: () => <MagneticButton>Launch project</MagneticButton>,
};

const MorphingDemo = () => {
  const [status, setStatus] = useState<MorphingButtonStatus>("idle");
  const cycle = () => {
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1800);
    }, 900);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
      <MorphingButton status={status} onClick={cycle} />
      <MorphingButton status="error" />
    </div>
  );
};

export const Morphing: Story = {
  render: () => <MorphingDemo />,
};

export const DragConfirm: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DragToConfirm label="Slide to delete" confirmedLabel="Deleted" />
      <DragToConfirm label="Disabled track" disabled />
    </div>
  ),
};

export const Toggle: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <LiquidToggle aria-label="Push notifications" defaultChecked />
      <LiquidToggle aria-label="Weekly digest" />
      <LiquidToggle aria-label="Disabled switch" disabled />
    </div>
  ),
};
