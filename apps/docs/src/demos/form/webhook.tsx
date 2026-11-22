"use client";

import {
  Button,
  Form,
  FormDescription,
  FormError,
  FormField,
  FormInput,
  FormLabel,
} from "@matt-ui/ui";
import { useState } from "react";

export default function FormWebhookDemo() {
  const [saved, setSaved] = useState("");

  return (
    <div className="w-full max-w-sm">
      <Form
        onFormSubmit={(values) => setSaved(`已保存 Webhook：${String(values.endpoint ?? "")}`)}
        className="flex flex-col gap-3.5"
      >
        <FormField name="endpoint">
          <FormLabel>事件回调地址</FormLabel>
          <FormInput type="url" required placeholder="https://api.example.com/webhooks/ui" />
          <FormDescription>组件库新版本发布后将向该地址推送签名事件。</FormDescription>
          <FormError />
        </FormField>
        <Button type="submit" variant="signal" size="sm">
          保存 Webhook
        </Button>
        {saved && <p className="m-0 font-mono text-xs text-muted-foreground">{saved}</p>}
      </Form>
    </div>
  );
}
