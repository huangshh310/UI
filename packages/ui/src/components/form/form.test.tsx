/**
 * Form 模块化表单系统的行为规约。
 * 测试接缝：@matt-ui/ui 的公开入口。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
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
  FormSection,
  FormTextarea,
} from "../../index.js";

afterEach(cleanup);

describe("Form", () => {
  it("校验失败时阻止提交并展示错误文案，修正后提交返回表单值", async () => {
    const onFormSubmit = vi.fn<(values: Record<string, unknown>) => void>();
    render(
      <Form onFormSubmit={onFormSubmit}>
        <FormField
          name="username"
          validate={(value) =>
            String(value ?? "").trim().length < 3 ? "用户名至少 3 个字符" : null
          }
        >
          <FormLabel required>用户名</FormLabel>
          <FormInput placeholder="输入用户名" />
          <FormDescription>将展示在个人主页</FormDescription>
          <FormError />
        </FormField>
        <FormField name="bio">
          <FormLabel optional>简介</FormLabel>
          <FormTextarea placeholder="一句话介绍" />
        </FormField>
        <FormActions>
          <Button type="submit">提交</Button>
        </FormActions>
      </Form>,
    );

    expect(screen.getByText("选填")).toBeTruthy();

    const username = screen.getByRole("textbox", { name: "用户名" });
    await userEvent.type(username, "ab");
    await userEvent.click(screen.getByRole("button", { name: "提交" }));

    expect(screen.getByText("用户名至少 3 个字符")).toBeTruthy();
    expect(onFormSubmit).not.toHaveBeenCalled();

    await userEvent.type(username, "cd");
    await userEvent.type(screen.getByRole("textbox", { name: /简介/ }), "前端工程师");
    await userEvent.click(screen.getByRole("button", { name: "提交" }));

    expect(onFormSubmit).toHaveBeenCalledTimes(1);
    expect(onFormSubmit.mock.calls[0]?.[0]).toMatchObject({
      username: "abcd",
      bio: "前端工程师",
    });
  });

  it("支持通过 errors 属性注入外部校验错误", () => {
    render(
      <Form errors={{ email: "该邮箱已被注册" }}>
        <FormField name="email">
          <FormLabel>邮箱</FormLabel>
          <FormInput type="email" />
          <FormError />
        </FormField>
      </Form>,
    );

    expect(screen.getByText("该邮箱已被注册")).toBeTruthy();
  });

  it("FormRadioGroup 放在 FormField 内时每个单选项仍保留各自的可访问名称并支持切换", async () => {
    const onValueChange = vi.fn<(value: string) => void>();
    render(
      <Form variant="card" controlVariant="filled" controlSize="sm">
        <FormSection title="计费方案" description="可随时升级或降级">
          <FormField name="plan" layout="horizontal">
            <FormLabel>方案</FormLabel>
            <FormRadioGroup
              aria-label="方案"
              orientation="horizontal"
              defaultValue="free"
              onValueChange={onValueChange}
            >
              <FormRadioItem value="free" label="免费版" description="适合个人项目" badge="当前" />
              <FormRadioItem
                value="pro"
                label="专业版"
                description="团队协作与优先支持"
                badge="推荐"
              />
            </FormRadioGroup>
          </FormField>
        </FormSection>
      </Form>,
    );

    expect(screen.getByText("计费方案")).toBeTruthy();
    expect(screen.getByText("推荐")).toBeTruthy();
    expect(screen.getByRole("radio", { name: "免费版" }).getAttribute("aria-checked")).toBe("true");
    await userEvent.click(screen.getByRole("radio", { name: "专业版" }));

    expect(onValueChange).toHaveBeenCalledWith("pro");
    expect(screen.getByRole("radio", { name: "专业版" }).getAttribute("aria-checked")).toBe("true");
  });
});
