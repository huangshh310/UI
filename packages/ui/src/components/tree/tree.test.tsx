import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Tree } from "../../index.js";

beforeAll(() => {
  if (typeof Element !== "undefined" && !Element.prototype.getAnimations) {
    Element.prototype.getAnimations = () => [];
  }
});

afterEach(cleanup);

const NODES = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "src/index.ts", label: "index.ts" },
      { id: "src/theme.css", label: "theme.css" },
    ],
  },
  { id: "package.json", label: "package.json" },
];

describe("Tree", () => {
  it("支持标准 tree/treeitem 语义、分支展开折叠与选中回调", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(val: string | null) => void>();

    render(<Tree ariaLabel="项目文件" nodes={NODES} onValueChange={onValueChange} />);
    expect(screen.getByRole("tree", { name: "项目文件" })).toBeTruthy();

    const srcItem = screen.getByRole("treeitem", { name: /src/ });
    srcItem.focus();
    await user.keyboard("{ArrowRight}");
    expect(await screen.findByRole("treeitem", { name: /index\.ts/ })).toBeTruthy();

    await user.click(screen.getByRole("treeitem", { name: /index\.ts/ }));
    expect(onValueChange).toHaveBeenCalledWith("src/index.ts");
  });
});
