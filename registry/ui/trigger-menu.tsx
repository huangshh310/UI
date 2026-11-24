// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * TriggerMenu：光标锚定多触发符检索浮层。
 * 支持内置单行/多行文本框，也可直接包裹 PromptInput 自动挂载至其内部输入元素。
 */

import { cn } from "@/lib/utils";
import {
  TriggerMenu as SdkTriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuItem,
  TriggerMenuItemIcon,
  TriggerMenuList,
  TriggerMenuStatus,
  textFieldAdapter,
  type TextEditorAdapter,
  type TriggerDefinition,
  type TriggerMenuDataItem,
} from "@ui-sdk/react/trigger-menu";
import { cva } from "class-variance-authority";
import { FileCode2, Hash, Terminal } from "lucide-react";
import { type ReactNode, useCallback, useMemo, useState } from "react";

export const triggerFieldVariants = cva(
  "w-full rounded-xl border border-solid border-input bg-background px-3 py-2 font-sans text-sm text-foreground shadow-2xs transition-[border-color,box-shadow] duration-(--ui-duration-fast) outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      multiline: {
        true: "min-h-20 resize-y leading-relaxed",
        false: "h-9",
      },
    },
    defaultVariants: {
      multiline: true,
    },
  },
);

export const TRIGGER_POPUP_CLASS =
  "z-(--ui-z-popover) min-w-56 max-w-xs overflow-hidden rounded-xl border border-solid border-border bg-popover p-1 text-popover-foreground shadow-md outline-none transition-[opacity,transform] duration-(--ui-duration-fast) data-[starting-style]:scale-98 data-[starting-style]:opacity-0 data-[ending-style]:scale-98 data-[ending-style]:opacity-0";

export const TRIGGER_LIST_CLASS = "flex max-h-60 flex-col gap-0.5 overflow-y-auto outline-none";

export const TRIGGER_ITEM_CLASS =
  "flex cursor-pointer items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 font-sans text-xs text-popover-foreground transition-colors outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-45";

export const TRIGGER_EMPTY_CLASS =
  "px-3 py-4 text-center font-sans text-xs text-muted-foreground empty:hidden";

export const TRIGGER_GROUP_HEADER_CLASS =
  "px-2.5 pt-1.5 pb-1 font-mono text-[10px] font-medium tracking-wide text-muted-foreground uppercase";
export interface TriggerMenuItemOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  icon?: ReactNode;
  keywords?: string[];
  disabled?: boolean;
  insertText?: string;
}

export interface TriggerMenuSource {
  char: string;
  type?: string;
  groupLabel?: string;
  boundary?: "start" | "line" | "word" | "anywhere";
  items: TriggerMenuItemOption[];
}

export interface TriggerMenuSelectPayload {
  value: string;
  trigger: string;
  item?: TriggerMenuItemOption;
}

export interface TriggerMenuProps {
  /** 触发规则列表（如 @ 文件、/ 指令、# 标签） */
  triggers: TriggerMenuSource[];
  /** 包裹自定义输入器（如 PromptInput）时自动绑定内部文本框；省略时渲染内置输入区 */
  children?: ReactNode;
  /** 受控文本值（仅内置输入模式） */
  value?: string;
  /** 非受控初始文本值（仅内置输入模式） */
  defaultValue?: string;
  /** 文本变化回调（仅内置输入模式） */
  onValueChange?: (value: string) => void;
  /** 选中建议项回调 */
  onSelect?: (payload: TriggerMenuSelectPayload) => void;
  /** 受控浮层开关 */
  open?: boolean;
  /** 浮层开关变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 内置输入是否采用多行文本框，默认 true */
  multiline?: boolean;
  /** 内置输入占位文案 */
  placeholder?: string;
  /** 无匹配项提示文案 */
  emptyText?: string;
  /** 内置输入框无障碍名称 */
  ariaLabel?: string;
  /** 是否禁用内置输入 */
  disabled?: boolean;
  /** 浮层首选弹出方向 */
  side?: "top" | "bottom";
  className?: string;
}
type NativeField = HTMLInputElement | HTMLTextAreaElement;

const createInteractiveFieldAdapter = (field: NativeField): TextEditorAdapter => {
  const base = textFieldAdapter(field);
  let replacing = false;
  let hadBeforeInput = false;
  const markBeforeInput = () => {
    hadBeforeInput = true;
  };

  return {
    ...base,
    replace(range, content) {
      replacing = true;
      try {
        base.replace(range, content);
      } finally {
        replacing = false;
      }
    },
    subscribe(listener) {
      field.addEventListener("beforeinput", markBeforeInput, true);
      const unsub = base.subscribe((change) => {
        if (change.type === "input") {
          const promoteUser = !change.user && !replacing && hadBeforeInput;
          hadBeforeInput = false;
          listener(promoteUser ? { ...change, user: true } : change);
          return;
        }
        listener(change);
      });
      return () => {
        field.removeEventListener("beforeinput", markBeforeInput, true);
        unsub();
      };
    },
  };
};

const useFieldAdapter = () => {
  const [editor, setEditor] = useState<TextEditorAdapter | undefined>(undefined);

  const hostRef = useCallback((host: HTMLDivElement | null) => {
    if (!host) {
      setEditor(undefined);
      return;
    }
    const field = host.querySelector<NativeField>("textarea, input");
    setEditor((prev) => {
      if (!field) return undefined;
      return prev?.element === field ? prev : createInteractiveFieldAdapter(field);
    });
  }, []);

  return { hostRef, editor };
};
const buildItemLookup = (sources: TriggerMenuSource[]) => {
  const map = new Map<string, TriggerMenuItemOption>();
  for (const src of sources) {
    for (const item of src.items) {
      map.set(`${src.char}:${item.value}`, item);
    }
  }
  return map;
};

const toTriggerDefinitions = (sources: TriggerMenuSource[]): TriggerDefinition[] =>
  sources.map((src) => ({
    char: src.char,
    type: src.type,
    boundary: src.boundary,
    insert: (item) => {
      const custom = src.items.find((opt) => opt.value === String(item.value))?.insertText;
      return custom ?? `${src.char}${item.label} `;
    },
    items: src.items.map((opt) => ({
      value: opt.value,
      label: opt.label,
      keywords: opt.keywords,
      disabled: opt.disabled,
    })),
  }));

const DefaultTriggerIcon = ({ triggerChar }: { triggerChar?: string }) => {
  if (triggerChar === "/") return <Terminal className="size-3.5 text-signal" />;
  if (triggerChar === "#") return <Hash className="size-3.5 text-muted-foreground" />;
  return <FileCode2 className="size-3.5 text-muted-foreground" />;
};

const SuggestionRowContent = ({
  raw,
  meta,
  triggerChar,
}: {
  raw: TriggerMenuDataItem;
  meta?: TriggerMenuItemOption;
  triggerChar?: string;
}) => (
  <>
    <div className="flex min-w-0 items-center gap-2">
      <TriggerMenuItemIcon className="inline-flex shrink-0 items-center justify-center">
        {meta?.icon ?? <DefaultTriggerIcon triggerChar={triggerChar} />}
      </TriggerMenuItemIcon>
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{raw.label}</span>
        {meta?.description && (
          <span className="truncate text-[11px] text-muted-foreground">{meta.description}</span>
        )}
      </div>
    </div>
    {meta?.badge && (
      <span className="shrink-0 rounded-md border border-solid border-border/75 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
        {meta.badge}
      </span>
    )}
  </>
);

const BuiltinTriggerField = ({ p, multiline }: { p: TriggerMenuProps; multiline: boolean }) => {
  const sharedProps = {
    "data-slot": "trigger-menu-input",
    "aria-label": p.ariaLabel ?? "触发式输入框",
    placeholder: p.placeholder ?? "键入 @ 引用文件或 / 调用指令…",
    disabled: p.disabled,
    ...(p.value !== undefined ? { value: p.value } : { defaultValue: p.defaultValue }),
    className: triggerFieldVariants({ multiline }),
  };

  if (!multiline) {
    return (
      <input
        type="text"
        {...sharedProps}
        onChange={(e) => p.onValueChange?.(e.currentTarget.value)}
      />
    );
  }
  return <textarea {...sharedProps} onChange={(e) => p.onValueChange?.(e.currentTarget.value)} />;
};

const TriggerPopupBody = ({
  side,
  emptyText,
  groupLookup,
  itemLookup,
}: {
  side?: "top" | "bottom";
  emptyText?: string;
  groupLookup: Map<string, string | undefined>;
  itemLookup: Map<string, TriggerMenuItemOption>;
}) => (
  <TriggerMenuContent side={side ?? "bottom"} sideOffset={6} className={TRIGGER_POPUP_CLASS}>
    <TriggerMenuEmpty className={TRIGGER_EMPTY_CLASS}>
      {(state) => (state.empty && !state.loading ? (emptyText ?? "没有匹配项") : null)}
    </TriggerMenuEmpty>
    <TriggerMenuList className={TRIGGER_LIST_CLASS}>
      {(state) => {
        const groupLabel = state.trigger ? groupLookup.get(state.trigger) : undefined;
        const list = state.items as TriggerMenuDataItem[];
        return (
          <>
            {groupLabel && list.length > 0 && (
              <div className={TRIGGER_GROUP_HEADER_CLASS}>{groupLabel}</div>
            )}
            {list.map((raw) => (
              <TriggerMenuItem
                key={String(raw.value)}
                value={String(raw.value)}
                label={raw.label}
                disabled={raw.disabled}
                className={TRIGGER_ITEM_CLASS}
              >
                <SuggestionRowContent
                  raw={raw}
                  meta={itemLookup.get(`${state.trigger ?? ""}:${String(raw.value)}`)}
                  triggerChar={state.trigger ?? undefined}
                />
              </TriggerMenuItem>
            ))}
          </>
        );
      }}
    </TriggerMenuList>
  </TriggerMenuContent>
);

export const TriggerMenu = (props: TriggerMenuProps) => {
  const multiline = props.multiline ?? true;
  const { hostRef, editor } = useFieldAdapter();
  const defs = useMemo(() => toTriggerDefinitions(props.triggers), [props.triggers]);
  const itemLookup = useMemo(() => buildItemLookup(props.triggers), [props.triggers]);
  const groupLookup = useMemo(
    () => new Map(props.triggers.map((s) => [s.char, s.groupLabel])),
    [props.triggers],
  );

  return (
    <div data-slot="trigger-menu" className={cn("relative w-full", props.className)}>
      <SdkTriggerMenu
        triggers={defs}
        editor={editor}
        open={props.open}
        onOpenChange={(next) => props.onOpenChange?.(next)}
        onSelect={(val, details) => {
          const item = itemLookup.get(`${details.trigger}:${String(val)}`);
          props.onSelect?.({ value: String(val), trigger: details.trigger, item });
        }}
      >
        <div ref={hostRef} className="w-full">
          {props.children ?? <BuiltinTriggerField p={props} multiline={multiline} />}
        </div>
        <div className="sr-only">
          <TriggerMenuStatus />
        </div>
        <TriggerPopupBody
          side={props.side}
          emptyText={props.emptyText}
          groupLookup={groupLookup}
          itemLookup={itemLookup}
        />
      </SdkTriggerMenu>
    </div>
  );
};
