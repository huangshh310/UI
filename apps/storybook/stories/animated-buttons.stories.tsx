/**
 * 带动效的按钮组件的 Stories：每个组件一个，用于开发时逐个检查。
 */
import {
  BookCallButton,
  CodeSnippetDeck,
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

export const CodeDeck: Story = {
  render: () => (
    <CodeSnippetDeck
      snippets={[
        {
          language: "curl",
          label: "cURL",
          code: 'curl "https://api.tidewater.dev/v1/projects?limit={{limit}}" -H "Authorization: Bearer {{token}}"',
        },
        {
          language: "ts",
          label: "TypeScript",
          code: 'fetch("https://api.tidewater.dev/v1/projects?limit={{limit}}", { headers: { Authorization: "Bearer {{token}}" } })',
        },
        {
          language: "python",
          label: "Python",
          code: 'requests.get("https://api.tidewater.dev/v1/projects", params={"limit": {{limit}}})',
        },
      ]}
      parameters={[
        { name: "limit", label: "Limit", defaultValue: "20" },
        { name: "token", label: "API Token", defaultValue: "tk_live_98a1" },
      ]}
    />
  ),
};
