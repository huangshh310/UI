/**
 * Form 的文档数据。
 */
import { FormBasic } from "@/demos/form/basic";
import type { ComponentDoc } from "./registry.types";

export const FORM_DOC: ComponentDoc = {
  slug: "form",
  name: "Form",
  description:
    "基于 Base UI Form、Field 与 RadioGroup 的模块化可组合表单系统，内置无障碍校验关联与错误提示。",
  category: "forms",
  registryName: "form",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  usage: `import { Form, FormField, FormLabel, FormInput, FormError } from "@/components/ui/form";

export function Demo() {
  return (
    <Form onFormSubmit={(values) => console.log(values)}>
      <FormField name="email">
        <FormLabel required>邮箱</FormLabel>
        <FormInput type="email" required />
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
      description: "包含文本输入、多行输入、卡片式单选组、辅助说明与自定义校验错误提示。",
      file: "form/basic.tsx",
      Demo: FormBasic,
    },
  ],
  api: [
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
      name: "FormField.validate",
      type: "(value: unknown) => string | string[] | null | void",
      defaultValue: "-",
      description: "单字段自定义校验规则。",
    },
    {
      name: "FormRadioGroup / FormRadioItem",
      type: "Compound parts",
      defaultValue: "-",
      description: "带卡片外观与方向键导航的单选组部件。",
    },
  ],
  accessibility: [
    "FormField 自动为标签、控件、说明与错误提示生成并关联 id、aria-describedby 和 aria-invalid。",
    "校验失败时阻止提交，并将焦点定位到首个无效字段。",
    "FormRadioGroup 遵循 WAI-ARIA radiogroup 键盘约定，支持方向键切换选项。",
  ],
};
