/**
 * Button 的 Stories：每个 Story 是组件的一个状态用例。
 * 用工具栏的 Theme 在浅色与深色之间切换。
 */
import { Button, type ButtonSize, type ButtonVariant } from "@matt-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
  "signal",
];

const SIZES: ButtonSize[] = ["sm", "md", "lg"];

/** 示例图标 */
const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M3 8h10m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 横向排列多个按钮的容器 */
const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>{children}</div>
);

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Save changes",
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
  },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: [...SIZES, "icon"] },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 可在 Controls 面板中调整全部属性 */
export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Row>
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </Row>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Row>
      {SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          size {size}
        </Button>
      ))}
    </Row>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <Row>
      <Button {...args}>
        Continue
        <ArrowIcon />
      </Button>
      <Button {...args} variant="signal">
        Continue
        <ArrowIcon />
      </Button>
    </Row>
  ),
};

/** 只含图标时必须提供 aria-label */
export const IconOnly: Story = {
  args: { size: "icon", variant: "outline", "aria-label": "Continue", children: <ArrowIcon /> },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** 加载中：显示旋转指示器，点击与键盘激活都被忽略，但按钮仍可聚焦 */
export const Loading: Story = {
  render: (args) => (
    <Row>
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant} loading>
          {variant}
        </Button>
      ))}
    </Row>
  ),
};
