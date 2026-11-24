"use client";

/**
 * TriggerMenu：光标锚定多触发符检索浮层。
 * 支持内置单行/多行文本框，也可直接包裹 PromptInput 自动挂载至其内部输入元素。
 */
import { cn } from "@matt-ui/utils";
import {
  TriggerMenu as SdkTriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuItem,
  TriggerMenuItemIcon,
  TriggerMenuList,
  TriggerMenuStatus,
  type TriggerDefinition,
  type TriggerMenuDataItem,
} from "@ui-sdk/react/trigger-menu";
import { FileCode2, Hash, Terminal } from "lucide-react";
import { useMemo } from "react";
import { useFieldAdapter } from "./trigger-menu-1-adapter.js";
import type {
  TriggerMenuItemOption,
  TriggerMenuProps,
  TriggerMenuSource,
} from "./trigger-menu.types.js";
import {
  TRIGGER_EMPTY_CLASS,
  TRIGGER_GROUP_HEADER_CLASS,
  TRIGGER_ITEM_CLASS,
  TRIGGER_LIST_CLASS,
  TRIGGER_POPUP_CLASS,
  triggerFieldVariants,
} from "./trigger-menu.variants.js";

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
  if (triggerChar === "/") return <Terminal className="size-3.5 text-info" />;
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
      <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
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
