/**
 * Form 的文档数据。
 */
import { FormBasic } from "@/demos/form/basic";
import FormProfileDemo from "@/demos/form/profile";
import FormVariantsDemo from "@/demos/form/variants";
import FormWebhookDemo from "@/demos/form/webhook";
import type { ComponentDoc } from "./registry.types";

export const FORM_DOC: ComponentDoc = {
  slug: "form",
  name: "Form",
  description:
    "极简模块化无障碍表单系统，支持表面与控件变体继承、水平分栏布局、分组操作栏与实时校验联动。",
  category: "forms",
  registryName: "form",
  dependencies: ["@base-ui/react", "class-variance-authority", "clsx", "tailwind-merge"],
  usage: `import { Form, FormField, FormLabel, FormInput, FormError, FormActions } from "@/components/ui/form";

export function Demo() {
  return (
    <Form variant="card" controlVariant="default" onFormSubmit={(values) => console.log(values)}>
      <FormField name="email">
        <FormLabel required>邮箱</FormLabel>
        <FormInput type="email" required placeholder="you@studio.dev" />
        <FormError />
      </FormField>
    </Form>
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "form-basic",
      name: "可组合表单与校验",
      description: "包含文本输入、多行输入、紧凑单选卡片、选填标注与自定义校验错误提示。",
      file: "form/basic.tsx",
      Demo: FormBasic,
    },
    {
      slug: "variants",
      name: "填充风变体与服务端错误回显",
      description: "展示 subtle 表面、filled 控件继承、双列单选网格与外部 errors 状态联动。",
      file: "form/variants.tsx",
      Demo: FormVariantsDemo,
      directory: false,
    },
    {
      slug: "profile",
      name: "分组与水平分栏设置表单",
      description: '组合 FormSection、layout="horizontal" 与失焦校验（onBlur）构建设置面板。',
      file: "form/profile.tsx",
      Demo: FormProfileDemo,
      directory: false,
    },
    {
      slug: "webhook",
      name: "URL 格式校验配置表单",
      description: "演示原生 URL 校验与提交回调，自动联动错误提示与无障碍描述。",
      file: "form/webhook.tsx",
      Demo: FormWebhookDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant / density",
      type: `"default" | "card" | "subtle" / "default" | "compact" | "relaxed"`,
      defaultValue: `"default" / "default"`,
      description: "表单容器外观（无框 / 发丝卡片 / 柔灰面板）与字段垂直间距密度。",
    },
    {
      name: "controlVariant / controlSize / controlRadius",
      type: `"default" | "filled" | "ghost" / "sm" | "md" | "lg" / "md" | "lg" | "pill"`,
      defaultValue: `"default" / "md" / "md"`,
      description: "透传给内部 FormInput 与 FormTextarea 的默认外观、尺寸与圆角。",
    },
    {
      name: "validationMode",
      type: `"onSubmit" | "onBlur" | "onChange"`,
      defaultValue: `"onSubmit"`,
      description: "表单触发校验的时机。",
    },
    {
      name: "errors",
      type: "Record<string, string | string[]>",
      defaultValue: "-",
      description: "外部（如服务端）返回的字段错误映射。",
    },
    {
      name: "onFormSubmit",
      type: "(values: Record<string, unknown>) => void",
      defaultValue: "-",
      description: "全部字段校验通过后提交的回调。",
    },
    {
      name: "FormField.layout / validate",
      type: `"vertical" | "horizontal" / (value: unknown) => string | string[] | null | void`,
      defaultValue: `"vertical" / -`,
      description: "单字段排布方向（纵向堆叠或桌面端左右分栏）与自定义校验函数。",
    },
    {
      name: "FormLabel.required / optional",
      type: "boolean / boolean",
      defaultValue: "false / false",
      description: "显示必填星号或柔和的“选填”标注。",
    },
    {
      name: "FormSection / FormActions",
      type: "Compound parts",
      defaultValue: "-",
      description:
        "带标题和分割线的字段分组容器，以及支持 start / end / between 对齐的底部操作栏。",
    },
    {
      name: "FormRadioGroup / FormRadioItem",
      type: "Compound parts",
      defaultValue: "-",
      description:
        "支持 vertical / horizontal 网格排布、card / compact / minimal 变体与 badge 徽章的单选组。",
    },
  ],
  accessibility: [
    "FormField 自动为标签、控件、说明与错误提示生成并关联 id、aria-describedby 和 aria-invalid。",
    "校验失败时阻止提交，并将焦点定位到首个无效字段。",
    "FormRadioGroup 遵循 WAI-ARIA radiogroup 键盘约定，支持方向键切换选项。",
  ],
};
