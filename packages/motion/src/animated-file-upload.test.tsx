/**
 * AnimatedFileUpload 单元测试：验证文件选择、类型/体积/数量校验、uploadAdapter 进度与重试、移除及清理。
 */
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnimatedFileUpload, type UploadAdapter } from "./index.js";

afterEach(cleanup);

describe("AnimatedFileUpload", () => {
  it("选择文件后展示列表，并支持移除与清空", async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn<(files: unknown[]) => void>();

    render(<AnimatedFileUpload onFilesChange={onFilesChange} />);

    const input = screen.getByLabelText("选择要上传的文件");
    const file = new File(["hello"], "spec.md", { type: "text/markdown" });
    await user.upload(input, file);

    expect(await screen.findByText("spec.md")).toBeTruthy();
    expect(onFilesChange).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "移除 spec.md" }));
    await waitFor(() => {
      expect(screen.queryByText("spec.md")).toBeNull();
    });
  });

  it("拦截超出大小或数量限制的文件并给出错误提示", async () => {
    const user = userEvent.setup();

    render(<AnimatedFileUpload maxSize={10} maxFiles={1} />);
    const input = screen.getByLabelText("选择要上传的文件");
    const largeFile = new File(["0123456789abcdef"], "huge.txt", { type: "text/plain" });

    await user.upload(input, largeFile);

    expect(screen.getByRole("alert").textContent).toContain("huge.txt");
    expect(screen.queryByRole("button", { name: "移除 huge.txt" })).toBeNull();
  });

  it("通过 uploadAdapter 汇报上传进度、失败态并支持重试成功", async () => {
    const user = userEvent.setup();
    let attempt = 0;
    const adapter = vi.fn<UploadAdapter>(async (_file, { onProgress }) => {
      attempt += 1;
      onProgress(60);
      if (attempt === 1) throw new Error("网络断开");
      onProgress(100);
    });

    render(<AnimatedFileUpload uploadAdapter={adapter} />);
    const input = screen.getByLabelText("选择要上传的文件");
    await user.upload(input, new File(["ok"], "report.pdf", { type: "application/pdf" }));

    expect(await screen.findByText("网络断开")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "重试 report.pdf" }));
    expect(await screen.findByText("已上传")).toBeTruthy();
    expect(adapter).toHaveBeenCalledTimes(2);
  });
});
