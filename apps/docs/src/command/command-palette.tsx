"use client";

/**
 * 命令面板：页头的搜索触发图标，以及 Cmd/Ctrl+K 打开的搜索对话框。
 */
import { Dialog } from "@base-ui/react/dialog";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { CommandSearch } from "./command-search";
import { useCommandPalette } from "./use-command-palette";

export const CommandPalette = () => {
  const router = useRouter();
  const { open, setOpen } = useCommandPalette();

  const select = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="打开搜索"
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <MagnifyingGlassIcon weight="bold" className="size-4 shrink-0" aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-(--ui-z-overlay) bg-background/75 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-[16vh] left-1/2 z-(--ui-z-modal) w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-3xl bg-popover p-2.5 text-popover-foreground shadow-xl outline-none">
          <Dialog.Title className="sr-only">搜索</Dialog.Title>
          <CommandSearch onSelect={select} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
