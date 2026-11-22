"use client";

/**
 * 示例：Form 的模块化字段组合、单选组与客户端校验。
 */
import {
  Button,
  Form,
  FormDescription,
  FormError,
  FormField,
  FormInput,
  FormLabel,
  FormRadioGroup,
  FormRadioItem,
  FormTextarea,
} from "@matt-ui/ui";
import { useState } from "react";

export const FormBasic = () => {
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <Form
      className="max-w-sm"
      onFormSubmit={(values) => setSubmitted(`${String(values.name)} · ${String(values.plan)}`)}
    >
      <FormField
        name="name"
        validate={(value) => (String(value ?? "").trim().length < 2 ? "项目名至少 2 个字符" : null)}
      >
        <FormLabel required>项目名称</FormLabel>
        <FormInput placeholder="例如：matt-ui" />
        <FormDescription>将作为仓库与部署地址前缀。</FormDescription>
        <FormError />
      </FormField>

      <FormField name="plan">
        <FormLabel>发布计划</FormLabel>
        <FormRadioGroup name="plan" defaultValue="oss" aria-label="发布计划">
          <FormRadioItem value="oss" label="开源发布" description="通过 shadcn Registry 公开分发" />
          <FormRadioItem value="team" label="团队私有" description="仅限内部工作区使用" />
        </FormRadioGroup>
      </FormField>

      <FormField name="note">
        <FormLabel>备注</FormLabel>
        <FormTextarea placeholder="可选说明…" rows={2} />
      </FormField>

      <div className="flex items-center justify-between gap-3">
        <Button type="submit">创建项目</Button>
        {submitted && (
          <span data-testid="form-result" className="font-mono text-xs text-muted-foreground">
            已提交：{submitted}
          </span>
        )}
      </div>
    </Form>
  );
};
