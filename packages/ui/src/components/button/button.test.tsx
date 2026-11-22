/**
 * Button 的行为规约。
 *
 * 测试接缝：@matt-ui/ui 的公开入口。
 * 只覆盖 Button 自己做出的行为决定；原生 <button> 本来就有的行为
 * （点击触发、disabled 不可点击、Enter 与空格激活）不重复验证。
 * 样式、主题与焦点环由消费方验证项目在真实浏览器中检查。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { FormEvent } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "../../index.js";

afterEach(cleanup);

describe("Button", () => {
  it("默认不是提交按钮：放在表单里点击不会提交表单", async () => {
    const onSubmit = vi.fn<(event: FormEvent) => void>((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Save</Button>
      </form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  describe("loading", () => {
    it("鼠标点击与键盘激活都不会触发 onClick", async () => {
      const onClick = vi.fn<() => void>();
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Save" });

      await userEvent.click(button);
      button.focus();
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");

      expect(onClick).not.toHaveBeenCalled();
    });

    it("提交按钮在加载中不会再次提交表单", async () => {
      const onSubmit = vi.fn<(event: FormEvent) => void>((event) => event.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Button type="submit" loading>
            Save
          </Button>
        </form>,
      );

      await userEvent.click(screen.getByRole("button", { name: "Save" }));

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("向辅助技术声明忙碌与不可用，但保留可访问名称和焦点", () => {
      render(<Button loading>Save</Button>);
      const button = screen.getByRole("button", { name: "Save" });

      button.focus();

      expect(button.getAttribute("aria-busy")).toBe("true");
      expect(button.getAttribute("aria-disabled")).toBe("true");
      // 不使用原生 disabled：否则加载开始的瞬间，正聚焦在按钮上的键盘用户会丢失焦点
      expect(document.activeElement).toBe(button);
    });
  });
});
