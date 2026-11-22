import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StaggeredList } from "../../index.js";

afterEach(cleanup);

describe("StaggeredList", () => {
  it("按序渲染全部子条目并保持完整语义结构", () => {
    render(
      <StaggeredList>
        <div>条目一</div>
        <div>条目二</div>
        <div>条目三</div>
      </StaggeredList>,
    );

    expect(screen.getByText("条目一")).toBeTruthy();
    expect(screen.getByText("条目二")).toBeTruthy();
    expect(screen.getByText("条目三")).toBeTruthy();
  });
});
