"use client";

/**
 * 示例：Form 的视觉风格（filled 填充态、双列单选卡片与外部校验错误）。
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
} from "@matt-ui/ui";
import { useState } from "react";

const INITIAL_ERRORS: Record<string, string> = {
  domain: "该子域名已被占用，请更换后再试",
};

const RegionPicker = () => (
  <FormField name="region">
    <FormLabel>默认部署区</FormLabel>
    <FormRadioGroup
      name="region"
      defaultValue="sgp"
      orientation="horizontal"
      aria-label="默认部署区"
    >
      <FormRadioItem
        value="sgp"
        variant="compact"
        label="新加坡"
        description="亚太低延迟"
        badge="推荐"
      />
      <FormRadioItem value="fra" variant="compact" label="法兰克福" description="欧洲合规区" />
    </FormRadioGroup>
  </FormField>
);

export default function FormVariantsDemo() {
  const [serverErrors, setServerErrors] = useState(INITIAL_ERRORS);
  const [saved, setSaved] = useState("");

  return (
    <Form
      variant="subtle"
      controlVariant="filled"
      controlRadius="lg"
      errors={serverErrors}
      className="max-w-md"
      onFormSubmit={(values) => {
        setServerErrors({});
        setSaved(`已切换至 ${String(values.domain ?? "")}（${String(values.region ?? "")}）`);
      }}
    >
      <FormField name="domain">
        <FormLabel required>工作区子域名</FormLabel>
        <FormInput
          defaultValue="studio"
          placeholder="输入英文子域名"
          onChange={() => {
            if (serverErrors.domain) setServerErrors({});
          }}
        />
        <FormDescription>支持字母、数字与连字符，立即生效。</FormDescription>
        <FormError />
      </FormField>
      <RegionPicker />
      <FormActions>
        <Button type="submit" variant="secondary" size="sm">
          保存域名配置
        </Button>
        {saved && <span className="font-mono text-xs text-muted-foreground">{saved}</span>}
      </FormActions>
    </Form>
  );
}
