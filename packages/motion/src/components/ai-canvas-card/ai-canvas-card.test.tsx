import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiCanvasCard } from "../../index.js";

afterEach(cleanup);

describe("AiCanvasCard", () => {
  it("支持生成视觉变体、切换 4K 放大与收藏回调", async () => {
    const user = userEvent.setup();
    const onRemix = vi.fn<(seed: number) => void>();
    const onFavoriteChange = vi.fn<(fav: boolean) => void>();

    render(<AiCanvasCard onRemix={onRemix} onFavoriteChange={onFavoriteChange} />);
    await user.click(screen.getByRole("button", { name: "生成变体" }));
    expect(onRemix).toHaveBeenCalledWith(1);
    expect(screen.getByText(/曜石琥珀/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "高清放大" }));
    expect(screen.getByText("4K UHD")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "收藏画作" }));
    expect(onFavoriteChange).toHaveBeenCalledWith(true);
  });
});
