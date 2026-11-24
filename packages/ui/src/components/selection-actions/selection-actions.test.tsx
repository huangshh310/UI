import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SelectionActions } from "../../index.js";

afterEach(cleanup);

describe("SelectionActions", () => {
  it("支持快捷指令点击并回传指令标识与选中文本", () => {
    const onAction = vi.fn<(actionId: string, selectedText: string) => void>();
    render(
      <SelectionActions
        selectedText="开心果口味周末销量领先"
        actions={[
          { id: "explain", label: "解释" },
          { id: "improve", label: "润色" },
        ]}
        onAction={onAction}
      />,
    );

    const toolbar = screen.getByRole("toolbar", { name: "选中文本智能操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("selection-actions");

    fireEvent.click(screen.getByRole("button", { name: "润色" }));
    expect(onAction).toHaveBeenCalledWith("improve", "开心果口味周末销量领先");
  });

  it("输入自然语言修改指令后提交并清空输入框", () => {
    const onSubmit = vi.fn<(instruction: string, selectedText: string) => void>();
    render(<SelectionActions selectedText="一段待改写文案" onSubmitInstruction={onSubmit} />);

    const input = screen.getByPlaceholderText("描述修改意图…") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "改成更简洁的语气" } });
    fireEvent.click(screen.getByRole("button", { name: "提交修改指令" }));

    expect(onSubmit).toHaveBeenCalledWith("改成更简洁的语气", "一段待改写文案");
    expect(input.value).toBe("");
  });
});
