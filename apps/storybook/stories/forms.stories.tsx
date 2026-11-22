/**
 * Forms 分类组件的 Stories：覆盖基础表单与动效表单的交互与主题检查。
 */
import { AnimatedFileUpload, OtpInput, StretchSwitch } from "@matt-ui/motion";
import {
  AdvancedDataTable,
  Button,
  Calendar,
  Combobox,
  DataTable,
  DatePicker,
  DrawCheckbox,
  Form,
  FormDescription,
  FormError,
  FormField,
  FormInput,
  FormLabel,
  FormRadioGroup,
  FormRadioItem,
  FormTextarea,
  LockInput,
  PromptInput,
  SpringSelect,
} from "@matt-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Forms",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const LockTextInput: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      <LockInput label="工作邮箱" placeholder="you@studio.dev" hint="聚焦时锁定焦点环" />
      <LockInput label="项目 ID" defaultValue="prj_01" locked />
      <LockInput label="错误状态" defaultValue="bad-email" error="请输入合法的邮箱地址" />
    </div>
  ),
};

export const Checkbox: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <DrawCheckbox label="默认勾选" defaultChecked />
      <DrawCheckbox label="信号色勾选" tone="signal" defaultChecked />
      <DrawCheckbox label="半选状态" indeterminate />
    </div>
  ),
};

export const Switch: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <StretchSwitch label="自动部署" description="按住查看拉伸弹性反馈" defaultChecked />
      <StretchSwitch label="信号色开关" tone="signal" defaultChecked />
    </div>
  ),
};

export const Select: Story = {
  render: () => (
    <SpringSelect
      label="部署区域"
      options={[
        { value: "tokyo", label: "Tokyo", description: "ap-northeast-1" },
        { value: "singapore", label: "Singapore", description: "ap-southeast-1" },
        { value: "frankfurt", label: "Frankfurt", disabled: true },
      ]}
    />
  ),
};

export const SearchableCombobox: Story = {
  render: () => (
    <Combobox
      label="前端框架"
      options={[
        { value: "next", label: "Next.js", description: "React 全栈框架" },
        { value: "vite", label: "Vite", description: "轻量构建工具" },
        { value: "astro", label: "Astro", description: "内容优先框架" },
      ]}
    />
  ),
};

export const Otp: Story = {
  render: () => <OtpInput label="安全验证码" length={6} separatorAt={3} />,
};

export const ComposableForm: Story = {
  render: () => (
    <Form onFormSubmit={() => {}}>
      <FormField
        name="name"
        validate={(value) => (String(value ?? "").trim().length < 2 ? "项目名至少 2 个字符" : null)}
      >
        <FormLabel required>项目名称</FormLabel>
        <FormInput placeholder="matt-ui" />
        <FormDescription>将用于生成包名与仓库标识。</FormDescription>
        <FormError />
      </FormField>
      <FormField name="plan">
        <FormLabel>发布方式</FormLabel>
        <FormRadioGroup name="plan" defaultValue="oss" aria-label="发布方式">
          <FormRadioItem value="oss" label="开源发布" description="MIT 许可公开分发" />
          <FormRadioItem value="private" label="内部私有" description="仅限团队工作区" />
        </FormRadioGroup>
      </FormField>
      <FormField name="note">
        <FormLabel>说明</FormLabel>
        <FormTextarea placeholder="可选备注" rows={2} />
      </FormField>
      <div>
        <Button type="submit">保存设置</Button>
      </div>
    </Form>
  ),
};

export const DateCalendar: Story = {
  render: () => (
    <Calendar
      mode="range"
      defaultMonth={new Date(2026, 10, 1)}
      defaultRange={{ start: new Date(2026, 10, 10), end: new Date(2026, 10, 16) }}
    />
  ),
};

export const PopoverDatePicker: Story = {
  render: () => (
    <DatePicker
      label="发布日期"
      defaultValue={new Date(2026, 10, 22)}
      presets={[
        { label: "今天", value: new Date(2026, 10, 22) },
        { label: "本月末", value: new Date(2026, 10, 30) },
      ]}
    />
  ),
};

export const FileUpload: Story = {
  render: () => <AnimatedFileUpload accept="image/*,.pdf,.md" maxFiles={4} />,
};

export const AiPromptInput: Story = {
  render: () => (
    <PromptInput
      models={[
        { id: "flash", label: "Flash" },
        { id: "pro", label: "Pro" },
      ]}
      selectedModel="pro"
      attachments={[{ id: "1", name: "tokens.css", size: "4 KB" }]}
      suggestions={["优化暗色对比度", "生成表单校验规则"]}
      hint="Enter 发送 · Shift+Enter 换行"
    />
  ),
};

export const BasicDataTable: Story = {
  render: () => (
    <DataTable
      title="部署节点"
      searchable
      selectable
      data={[
        { id: "1", name: "matt-ui-docs", region: "tokyo", ms: 18 },
        { id: "2", name: "registry-edge", region: "singapore", ms: 32 },
        { id: "3", name: "storybook", region: "frankfurt", ms: 94 },
      ]}
      columns={[
        { id: "name", header: "项目", accessor: (r) => r.name, sortable: true },
        { id: "region", header: "区域", accessor: (r) => r.region },
        { id: "ms", header: "延迟 (ms)", accessor: (r) => r.ms, sortable: true, align: "right" },
      ]}
    />
  ),
};

export const AdvancedTable: Story = {
  render: () => (
    <AdvancedDataTable
      title="组件清单"
      data={[
        { id: "1", name: "Button", pkg: "ui", status: "stable" },
        { id: "2", name: "Calendar", pkg: "ui", status: "new" },
        { id: "3", name: "AnimatedFileUpload", pkg: "motion", status: "new" },
      ]}
      columns={[
        { id: "name", header: "组件", accessor: (r) => r.name, sortable: true, hideable: false },
        { id: "pkg", header: "包", accessor: (r) => r.pkg },
        { id: "status", header: "状态", accessor: (r) => r.status },
      ]}
      facets={[
        {
          id: "status",
          label: "状态",
          getValue: (r) => r.status,
          options: [
            { value: "new", label: "新增" },
            { value: "stable", label: "稳定" },
          ],
        },
      ]}
    />
  ),
};
