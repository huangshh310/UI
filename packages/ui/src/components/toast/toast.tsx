"use client";

/**
 * Toast：基于 Base UI Toast 的堆叠通知容器与 useToast 钩子，隔离底座内部类型。
 */
import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "@matt-ui/utils";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import type { ToastInput, ToastPlacement, ToastProviderProps, ToastTone } from "./toast.types.js";

const PLACEMENT_CLASS: Record<ToastPlacement, string> = {
  "bottom-right": "right-4 bottom-4 sm:right-6 sm:bottom-6",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6",
  "top-right": "top-4 right-4 sm:top-6 sm:right-6",
};

const TONE_ICON: Record<ToastTone, { Icon: typeof Info; color: string }> = {
  default: { Icon: Info, color: "text-muted-foreground" },
  signal: { Icon: Info, color: "text-signal" },
  success: { Icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400" },
  destructive: { Icon: AlertCircle, color: "text-destructive" },
};

const ToastCard = ({
  item,
}: {
  item: ReturnType<typeof BaseToast.useToastManager<{ tone?: ToastTone }>>["toasts"][number];
}) => {
  const tone = item.data?.tone ?? "default";
  const { Icon, color } = TONE_ICON[tone];

  return (
    <BaseToast.Root
      toast={item}
      data-slot="toast"
      data-tone={tone}
      className={cn(
        "flex w-88 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-solid border-border bg-popover p-4 text-popover-foreground shadow-lg",
        "transition-[opacity,transform] duration-(--ui-duration-fast) ease-(--ui-ease-out) motion-reduce:transition-none",
        "data-starting-style:translate-y-2 data-starting-style:opacity-0 data-ending-style:translate-y-2 data-ending-style:opacity-0",
      )}
    >
      <Icon aria-hidden="true" className={cn("mt-0.5 size-4 shrink-0", color)} />
      <BaseToast.Content className="min-w-0 flex-1">
        {item.title && (
          <BaseToast.Title className="m-0 font-sans text-sm font-medium leading-snug text-foreground">
            {item.title}
          </BaseToast.Title>
        )}
        {item.description && (
          <BaseToast.Description className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
            {item.description}
          </BaseToast.Description>
        )}
      </BaseToast.Content>
      {item.actionProps && (
        <BaseToast.Action className="h-7 shrink-0 cursor-pointer rounded-md border border-solid border-border bg-background px-2.5 font-sans text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-card" />
      )}
      <BaseToast.Close
        aria-label="关闭通知"
        aria-hidden={false}
        className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X aria-hidden="true" className="size-3.5" />
      </BaseToast.Close>
    </BaseToast.Root>
  );
};

const ToastList = ({ placement }: { placement: ToastPlacement }) => {
  const { toasts } = BaseToast.useToastManager<{ tone?: ToastTone }>();
  if (toasts.length === 0) return null;

  return (
    <BaseToast.Portal>
      <BaseToast.Viewport
        data-slot="toast-viewport"
        className={cn("fixed z-50 flex flex-col gap-2 outline-none", PLACEMENT_CLASS[placement])}
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} />
        ))}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
};

export const ToastProvider = ({
  children,
  placement = "bottom-right",
  timeout = 4000,
  limit = 4,
}: ToastProviderProps) => (
  <BaseToast.Provider timeout={timeout} limit={limit}>
    {children}
    <ToastList placement={placement} />
  </BaseToast.Provider>
);

export const useToast = () => {
  const manager = BaseToast.useToastManager<{ tone?: ToastTone }>();

  const toast = (input: ToastInput) =>
    manager.add({
      title: input.title,
      description: input.description,
      timeout: input.timeout,
      data: { tone: input.tone ?? "default" },
      actionProps: input.actionLabel
        ? { children: input.actionLabel, onClick: input.onAction }
        : undefined,
    });

  return { toast, dismiss: manager.close };
};
