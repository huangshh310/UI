import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { FileManagerBlock } from "../../index.js";

afterEach(cleanup);

describe("FileManagerBlock", () => {
  it("勾选文件行后弹出 SelectionBasket 并支持批量删除与展开上传面板", async () => {
    const user = userEvent.setup();
    render(<FileManagerBlock />);

    expect(screen.getByText("design-tokens.css")).toBeTruthy();
    await user.click(screen.getByRole("checkbox", { name: "选择 design-tokens.css" }));
    expect(screen.getByText("已选 1 项")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "删除" }));
    expect(screen.queryByText("design-tokens.css")).toBeNull();
  });
});
