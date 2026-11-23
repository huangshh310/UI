"use client";

/**
 * 示例：FormSection 与水平分栏（layout="horizontal"）组合的账户资料设置表单。
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
  FormSection,
  FormTextarea,
} from "@matt-ui/ui";
import { useState } from "react";

export default function FormProfileDemo() {
  const [status, setStatus] = useState("");

  return (
    <Form
      variant="card"
      validationMode="onBlur"
      className="max-w-lg"
      onFormSubmit={(values) => setStatus(`已更新资料：${String(values.displayName ?? "")}`)}
    >
      <FormSection title="公开资料" description="展示在提交记录与组件作者页中的基础信息。">
        <FormField
          name="displayName"
          layout="horizontal"
          validate={(val) => (String(val ?? "").trim().length < 2 ? "昵称至少 2 个字符" : null)}
        >
          <FormLabel required>显示昵称</FormLabel>
          <FormInput defaultValue="Lin" placeholder="你的公开昵称" />
          <FormError />
        </FormField>

        <FormField name="headline" layout="horizontal">
          <FormLabel optional>个人简介</FormLabel>
          <FormTextarea rows={2} placeholder="例如：Design Engineer · React & Motion" />
          <FormDescription>最多 120 字，支持纯文本。</FormDescription>
        </FormField>
      </FormSection>

      <FormActions align="end">
        {status && (
          <span className="mr-auto font-mono text-xs text-muted-foreground">{status}</span>
        )}
        <Button type="submit" variant="signal" size="sm">
          更新资料
        </Button>
      </FormActions>
    </Form>
  );
}
