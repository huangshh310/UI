import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Separator } from "../../index.js";

afterEach(cleanup);

describe("Separator", () => {
  it("支持水平、垂直方向以及居中文字标签分隔线", () => {
    render(
      <div>
        <Separator label="或使用邮箱继续" />
        <Separator orientation="vertical" />
      </div>,
    );

    expect(screen.getByText("或使用邮箱继续")).toBeTruthy();
    expect(screen.getAllByRole("separator").length).toBeGreaterThanOrEqual(2);
  });
});
