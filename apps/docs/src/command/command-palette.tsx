"use client";

/**
 * 命令面板：页头的搜索触发胶囊，以及 Cmd/Ctrl+K 打开的搜索对话框。
 * 对话框内置完整的焦点陷阱、Escape 关闭与关闭后焦点恢复。
 */
import { Dialog } from "@base-ui/react/dialog";
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
        aria-label="打开搜索"
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:bg-(--site-stage) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <MagnifyingGlassIcon weight="bold" className="size-4 shrink-0" aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-(--ui-z-overlay) bg-background/75 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-[16vh] left-1/2 z-(--ui-z-modal) w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-lg outline-none">
          <Dialog.Title className="sr-only">搜索</Dialog.Title>
          {/* 搜索区随对话框一起挂载与卸载，每次打开都从空的关键字开始 */}
          <CommandSearch onSelect={select} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
