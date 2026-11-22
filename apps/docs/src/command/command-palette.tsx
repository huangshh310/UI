"use client";

/**
 * 命令面板：页头的搜索按钮，以及 Cmd/Ctrl+K 打开的搜索对话框。
 * 对话框的焦点陷阱、Escape 关闭与焦点恢复由 Base UI 的 Dialog 提供。
 */
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@matt-ui/ui";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { CommandSearch } from "./command-search";
import { useCommandPalette } from "./use-command-palette";

export const CommandPalette = () => {
  const router = useRouter();
  const { open, setOpen } = useCommandPalette();

  /** 跳转到选中的条目并关闭面板 */
  const select = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Button variant="ghost" size="icon" aria-label="打开搜索" className="rounded-full" />
        }
      >
        <MagnifyingGlassIcon weight="bold" aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-(--ui-z-overlay) bg-background/70 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-[18vh] left-1/2 z-(--ui-z-modal) w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-lg outline-none">
          <Dialog.Title className="sr-only">搜索</Dialog.Title>
          {/* 搜索区随对话框一起挂载与卸载，每次打开都从空的关键字开始 */}
          <CommandSearch onSelect={select} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
