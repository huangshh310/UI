"use client";

/**
 * Toast：磨砂悬浮堆叠通知系统与 useToast 钩子，支持多方位停靠与无障碍实时播报。
 */
import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "@matt-ui/utils";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import type { ReactNode } from "react";
import type { ToastInput, ToastPlacement, ToastProviderProps, ToastTone } from "./toast.types.js";

interface ToastData {
  tone?: ToastTone;
  icon?: ReactNode;
  dismissible?: boolean;
}

type ManagedToast = ReturnType<typeof BaseToast.useToastManager<ToastData>>["toasts"][number];

const PLACEMENT_CLASS: Record<ToastPlacement, string> = {
  "bottom-right": "right-4 bottom-4 sm:right-6 sm:bottom-6",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6",
  "top-right": "top-4 right-4 sm:top-6 sm:right-6",
  "top-center": "top-4 left-1/2 -translate-x-1/2 sm:top-6",
};

const TONE_STYLE: Record<ToastTone, { Icon: typeof Info; badgeClass: string }> = {
  default: { Icon: Info, badgeClass: "bg-secondary text-muted-foreground" },
  signal: {
    Icon: Info,
    badgeClass: "bg-signal/12 text-blue-700 dark:bg-signal/20 dark:text-blue-300",
  },
  success: {
    Icon: CheckCircle2,
    badgeClass: "bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/18 dark:text-emerald-300",
  },
  warning: {
    Icon: AlertTriangle,
    badgeClass: "bg-amber-500/14 text-amber-800 dark:bg-amber-500/18 dark:text-amber-300",
  },
  destructive: {
    Icon: AlertCircle,
    badgeClass: "bg-destructive/12 text-destructive dark:bg-destructive/18",
  },
};

const ToastIcon = ({ tone, customIcon }: { tone: ToastTone; customIcon?: ReactNode }) => {
  const { Icon, badgeClass } = TONE_STYLE[tone];
  return (
    <span
      data-slot="toast-icon"
      aria-hidden="true"
      className={cn(
        "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg",
        badgeClass,
      )}
    >
      {customIcon ?? <Icon className="size-4" />}
    </span>
  );
};

const ToastBody = ({ item }: { item: ManagedToast }) => (
  <BaseToast.Content className="min-w-0 flex-1 pt-0.5">
    {item.title && (
      <BaseToast.Title className="m-0 font-sans text-sm leading-snug font-medium text-foreground">
        {item.title}
      </BaseToast.Title>
    )}
    {item.description && (
      <BaseToast.Description className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
        {item.description}
      </BaseToast.Description>
    )}
  </BaseToast.Content>
);

const ToastCard = ({ item }: { item: ManagedToast }) => {
  const tone = item.data?.tone ?? "default";
  const dismissible = item.data?.dismissible ?? true;

  return (
    <BaseToast.Root
      toast={item}
      data-slot="toast"
      data-tone={tone}
      className={cn(
        "flex w-[376px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-2xl border border-solid border-border/85 bg-popover/90 px-4 py-3.5 text-popover-foreground shadow-lg backdrop-blur-xl backdrop-saturate-150 dark:border-foreground/12 dark:bg-popover/88",
        "transition-[opacity,transform] duration-(--ui-duration-fast) ease-(--ui-ease-out) motion-reduce:transition-none",
        "data-starting-style:translate-y-2 data-starting-style:scale-[0.97] data-starting-style:opacity-0 data-ending-style:translate-y-1 data-ending-style:scale-[0.97] data-ending-style:opacity-0",
      )}
    >
      <ToastIcon tone={tone} customIcon={item.data?.icon} />
      <ToastBody item={item} />
      {item.actionProps && (
        <BaseToast.Action className="mt-0.5 h-7 shrink-0 cursor-pointer rounded-lg border border-solid border-border bg-card px-2.5 font-sans text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      )}
      {dismissible && (
        <BaseToast.Close
          aria-label="关闭通知"
          aria-hidden={false}
          className="mt-0.5 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X aria-hidden="true" className="size-3.5" />
        </BaseToast.Close>
      )}
    </BaseToast.Root>
  );
};

const ToastList = ({ placement }: { placement: ToastPlacement }) => {
  const { toasts } = BaseToast.useToastManager<ToastData>();
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport
        data-slot="toast-viewport"
        className={cn("fixed z-50 flex flex-col gap-2.5 outline-none", PLACEMENT_CLASS[placement])}
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
  const manager = BaseToast.useToastManager<ToastData>();

  const toast = (input: ToastInput) =>
    manager.add({
      title: input.title,
      description: input.description,
      timeout: input.timeout,
      data: {
        tone: input.tone ?? "default",
        icon: input.icon,
        dismissible: input.dismissible ?? true,
      },
      actionProps: input.actionLabel
        ? { children: input.actionLabel, onClick: input.onAction }
        : undefined,
    });

  return { toast, dismiss: manager.close };
};
