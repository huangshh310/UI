/**
 * Message 行为规约：验证角色对齐语义、元信息头、分支版本切换、复制与反馈动作、原位编辑重发以及异常重试态。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchSelector,
  MessageContent,
  MessageEditForm,
} from "../../index.js";

afterEach(cleanup);

describe("Message", () => {
  it("MessageBranch 在多个候选回复间切换并同步页码与回调", async () => {
    const user = userEvent.setup();
    const onBranchChange = vi.fn<(branch: number) => void>();

    render(
      <Message from="assistant" author="Matt AI" model="Claude 4.5" timestamp="14:22">
        <MessageBranch onBranchChange={onBranchChange}>
          <MessageBranchContent>
            <div key="v1">候选版本一：极简无框画布</div>
            <div key="v2">候选版本二：统一轨迹线语法</div>
          </MessageBranchContent>
          <MessageActions>
            <MessageBranchSelector />
          </MessageActions>
        </MessageBranch>
      </Message>,
    );

    expect(screen.getByText("Matt AI")).toBeTruthy();
    expect(screen.getByText("Claude 4.5")).toBeTruthy();
    expect(screen.getByText("候选版本一：极简无框画布")).toBeTruthy();
    expect(screen.queryByText("候选版本二：统一轨迹线语法")).toBeNull();
    expect(screen.getByText("1 / 2")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "下一分支版本" }));
    expect(onBranchChange).toHaveBeenCalledWith(1);
    expect(screen.getByText("候选版本二：统一轨迹线语法")).toBeTruthy();
    expect(screen.getByText("2 / 2")).toBeTruthy();
  });

  it("status=error 时展示错误横幅并响应重试，status=stopped 时标记已停止", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn<() => void>();

    const { rerender } = render(
      <Message from="assistant" status="error" errorMessage="上游模型连接超时" onRetry={onRetry}>
        <MessageContent>半截输出</MessageContent>
      </Message>,
    );

    expect(screen.getByText("上游模型连接超时")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "重试生成" }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(
      <Message from="assistant" status="stopped" variant="compact">
        <MessageContent>用户主动中断的段落</MessageContent>
      </Message>,
    );
    expect(screen.getByText("已停止生成")).toBeTruthy();
    expect(document.querySelector('[data-slot="message"]')?.getAttribute("data-variant")).toBe(
      "compact",
    );
  });

  it("MessageAction 支持复制状态切换与点赞 aria-pressed，MessageEditForm 支持修改保存与 Esc 取消", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn<(v: string) => void>();
    const onCancel = vi.fn<() => void>();

    render(
      <div>
        <Message from="assistant">
          <MessageContent>正文内容</MessageContent>
          <MessageActions>
            <MessageAction label="复制回复" copyText="正文内容">
              复制
            </MessageAction>
            <MessageAction label="赞同回复" active>
              赞
            </MessageAction>
          </MessageActions>
        </Message>
        <MessageEditForm defaultValue="原始提问" onSave={onSave} onCancel={onCancel} />
      </div>,
    );

    expect(screen.getByRole("button", { name: "赞同回复" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
    await user.click(screen.getByRole("button", { name: "复制回复" }));
    expect(screen.getByRole("button", { name: "已复制" })).toBeTruthy();

    const editor = screen.getByRole("textbox", { name: "编辑消息内容" });
    await user.clear(editor);
    await user.type(editor, "补充了约束的新提问");
    await user.click(screen.getByRole("button", { name: "保存并重发" }));
    expect(onSave).toHaveBeenCalledWith("补充了约束的新提问");

    editor.focus();
    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
