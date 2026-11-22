/**
 * cn() 的行为规约。
 *
 * 测试接缝：@matt-ui/utils 的公开入口。
 * 关注点不是 clsx 或 tailwind-merge 本身，而是它们与本项目
 * Design Token 产生的类名（bg-signal、text-muted-foreground 等）组合后的结果。
 */
import { describe, expect, it } from "vitest";
import { cn } from "./index.js";

describe("cn", () => {
  it("后传入的语义色覆盖先传入的同类语义色", () => {
    expect(cn("bg-primary", "bg-signal")).toBe("bg-signal");
  });

  it("字号与语义文字色同为 text- 前缀时互不覆盖", () => {
    expect(cn("text-sm", "text-muted-foreground")).toBe("text-sm text-muted-foreground");
  });

  it("使用者传入的 className 覆盖组件默认样式，条件为假的类名被忽略", () => {
    const isDisabled = false;
    const userClassName = "rounded-none px-6";

    expect(cn("rounded-md px-4 font-medium", isDisabled && "opacity-50", userClassName)).toBe(
      "font-medium rounded-none px-6",
    );
  });
});
