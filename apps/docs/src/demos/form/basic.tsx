"use client";

/**
 * 示例：Form 的模块化字段组合、单选组与客户端校验。
 */
import {
  Button,
  Form,
  FormActions,
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

const validateProjectName = (value: unknown) =>
  String(value ?? "").trim().length < 2 ? "项目名至少 2 个字符" : null;

export const FormBasic = () => {
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <Form
      density="compact"
      controlSize="sm"
      className="max-w-sm"
      onFormSubmit={(values) => setSubmitted(`${String(values.name)} · ${String(values.plan)}`)}
    >
      <FormField name="name" validate={validateProjectName}>
        <FormLabel required>项目名称</FormLabel>
        <FormInput placeholder="例如：matt-ui" />
        <FormDescription>将作为仓库与部署地址前缀。</FormDescription>
        <FormError />
      </FormField>

      <FormField name="plan">
        <FormLabel>发布计划</FormLabel>
        <FormRadioGroup name="plan" defaultValue="oss" aria-label="发布计划">
          <FormRadioItem
            value="oss"
            variant="compact"
            label="开源发布"
            description="通过组件 Registry 公开分发源码"
            badge="免费"
          />
          <FormRadioItem
            value="team"
            variant="compact"
            label="团队私有"
            description="仅限内部工作区使用"
          />
        </FormRadioGroup>
      </FormField>

      <FormField name="note">
        <FormLabel optional>备注</FormLabel>
        <FormTextarea placeholder="可选说明…" rows={2} />
      </FormField>

      <FormActions>
        <Button type="submit" variant="signal" size="sm">
          创建项目
        </Button>
        {submitted && (
          <span data-testid="form-result" className="font-mono text-xs text-muted-foreground">
            已提交：{submitted}
          </span>
        )}
      </FormActions>
    </Form>
  );
};
