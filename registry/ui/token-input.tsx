// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * TokenInput：结构化上下文标签输入框。
 * 在可编辑提示词正文中内联混排原子化上下文胶囊，支持退格策略配置、一键移除与触发浮层插入。
 */

import { cn } from "@/lib/utils";
import {
  TokenInput as SdkTokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
  toText,
  type Token,
  type TokenInputValue,
} from "@ui-sdk/react/token-input";
import {
  TriggerMenu as SdkTriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuItem,
  TriggerMenuList,
  type TriggerDefinition,
  type TriggerMenuDataItem,
} from "@ui-sdk/react/trigger-menu";
import { cva } from "class-variance-authority";
import { Check, FileCode2, Loader2, Terminal, X } from "lucide-react";
import { type ReactNode, useId, useMemo } from "react";

export const tokenShellVariants = cva(
  "flex w-full flex-col rounded-2xl border border-solid transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset data-[disabled]:cursor-not-allowed data-[disabled]:opacity-55",
  {
    variants: {
      variant: {
        default: "border-input bg-card shadow-2xs",
        subtle: "border-border/75 bg-muted/35",
      },
      invalid: {
        true: "border-destructive focus-within:border-destructive focus-within:ring-destructive",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      invalid: false,
    },
  },
);

export const TOKEN_EDITOR_CLASS =
  "min-h-11 w-full px-3.5 py-2.5 font-sans text-sm leading-7 text-foreground outline-none whitespace-pre-wrap break-words before:pointer-events-none before:text-muted-foreground/70 data-[empty]:before:content-[attr(aria-placeholder)]";

export const TOKEN_CHIP_BASE_CLASS =
  "mx-0.5 inline-flex items-center gap-1 rounded-md border border-solid px-1.5 py-0.5 align-baseline font-mono text-xs leading-none font-medium transition-colors select-none data-[selected]:ring-2 data-[selected]:ring-ring data-[pending]:opacity-65";

export const TOKEN_TONE_CLASS: Record<ContextTokenTone, string> = {
  default: "border-border bg-secondary/80 text-foreground dark:bg-secondary/60",
  signal: "border-signal/30 bg-signal/12 text-foreground dark:border-signal/40 dark:bg-signal/20",
  success:
    "border-emerald-600/20 bg-emerald-500/12 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/16 dark:text-emerald-300",
  warning:
    "border-amber-600/25 bg-amber-500/14 text-amber-900 dark:border-amber-400/25 dark:bg-amber-500/16 dark:text-amber-200",
};

export const TOKEN_POPUP_CLASS =
  "z-(--ui-z-popover) min-w-52 max-w-xs overflow-hidden rounded-xl border border-solid border-border bg-popover p-1 text-popover-foreground shadow-md outline-none";

export const TOKEN_POPUP_ITEM_CLASS =
  "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 font-sans text-xs text-popover-foreground outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-45";
export type ContextTokenTone = "default" | "signal" | "success" | "warning";

export interface ContextToken {
  id?: string;
  type: string;
  value: string;
  label: string;
  tone?: ContextTokenTone;
  status?: "idle" | "loading" | "done";
}

export type TokenInputSegment = string | ContextToken;

export interface TokenTriggerItem {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  keywords?: string[];
  disabled?: boolean;
}

export interface TokenTriggerSource {
  char: string;
  type: string;
  boundary?: "start" | "line" | "word" | "anywhere";
  items: TokenTriggerItem[];
}

export type TokenDeletionMode = "whole" | "select" | "revert";

export interface TokenInputProps {
  /** 受控混合片段数组 */
  value?: TokenInputSegment[];
  /** 非受控初始混合片段数组 */
  defaultValue?: TokenInputSegment[];
  /** 内容变更回调（同时回传结构化数组与纯文本序列化串） */
  onValueChange?: (value: TokenInputSegment[], serialized: string) => void;
  /** 快捷键或提交回调 */
  onSubmit?: (value: TokenInputSegment[], serialized: string) => void;
  /** 可选内联触发源（如键入 @ 插入文件胶囊、键入 / 插入指令胶囊） */
  triggers?: TokenTriggerSource[];
  /** 退格键遇到胶囊时的行为：整块删除、先选中再删或还原为纯文本 */
  tokenDeletion?: TokenDeletionMode;
  /** 提交快捷键：enter 单回车提交或 mod+enter 组合键提交 */
  submitShortcut?: "enter" | "mod+enter";
  placeholder?: string;
  emptyText?: string;
  label?: string;
  hint?: string;
  error?: string;
  ariaLabel?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** 是否在胶囊右侧展示删除按钮，默认 true */
  removable?: boolean;
  variant?: "default" | "subtle";
  /** 底部工具栏插槽 */
  footer?: ReactNode;
  className?: string;
}
const toSdkValue = (segments: TokenInputSegment[] | undefined): TokenInputValue | undefined =>
  segments?.map((seg) =>
    typeof seg === "string"
      ? seg
      : {
          id: seg.id,
          type: seg.type,
          value: seg.value,
          label: seg.label,
          data: {
            tone: seg.tone,
            status: seg.status,
            trigger: seg.type === "skill" || seg.type === "command" ? "/" : "@",
          },
        },
  );

const extractTone = (raw: unknown): ContextTokenTone | undefined =>
  raw === "default" || raw === "signal" || raw === "success" || raw === "warning" ? raw : undefined;

const extractStatus = (raw: unknown): ContextToken["status"] =>
  raw === "idle" || raw === "loading" || raw === "done" ? raw : undefined;

const fromSdkToken = (token: Token): ContextToken => ({
  id: token.id,
  type: token.type,
  value: token.value,
  label: token.label,
  tone: extractTone(token.data?.tone),
  status: extractStatus(token.data?.status),
});

const fromSdkValue = (val: TokenInputValue): TokenInputSegment[] =>
  val.map((seg) => (typeof seg === "string" ? seg : fromSdkToken(seg)));

const serializeTokenValue = (segments: TokenInputSegment[]): string =>
  toText(toSdkValue(segments) ?? []);

const toTokenTriggerDefs = (sources: TokenTriggerSource[]): TriggerDefinition[] =>
  sources.map((src) => ({
    char: src.char,
    type: src.type,
    boundary: src.boundary,
    items: src.items.map((item) => ({
      value: item.value,
      label: item.label,
      keywords: item.keywords,
      disabled: item.disabled,
    })),
  }));
const ChipLeadIcon = ({ type, status }: { type: string; status?: string }) => {
  if (status === "loading") return <Loader2 aria-hidden="true" className="size-3 animate-spin" />;
  if (status === "done") return <Check aria-hidden="true" className="size-3 text-signal" />;
  if (type === "skill" || type === "command") {
    return <Terminal aria-hidden="true" className="size-3 text-signal" />;
  }
  return <FileCode2 aria-hidden="true" className="size-3 text-muted-foreground" />;
};

const InlineTokenChip = ({ raw, canRemove }: { raw: Token; canRemove: boolean }) => {
  const parsed = fromSdkToken(raw);
  const defaultTone = parsed.type === "skill" || parsed.type === "command" ? "signal" : "default";
  const tone = parsed.tone ?? defaultTone;
  return (
    <TokenInputToken className={cn(TOKEN_CHIP_BASE_CLASS, TOKEN_TONE_CLASS[tone])}>
      <ChipLeadIcon type={parsed.type} status={parsed.status} />
      <span>{parsed.type === "skill" ? `/${parsed.label}` : parsed.label}</span>
      {canRemove && (
        <TokenInputTokenRemove className="ml-0.5 inline-flex size-3.5 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground">
          <X aria-hidden="true" className="size-2.5" />
        </TokenInputTokenRemove>
      )}
    </TokenInputToken>
  );
};

const InlineTriggerPopup = ({
  triggers,
  emptyText,
}: {
  triggers: TokenTriggerSource[];
  emptyText?: string;
}) => {
  const defs = useMemo(() => toTokenTriggerDefs(triggers), [triggers]);
  const badgeMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of triggers) {
      for (const it of s.items) {
        if (it.badge) m.set(`${s.char}:${it.value}`, it.badge);
      }
    }
    return m;
  }, [triggers]);

  return (
    <SdkTriggerMenu triggers={defs}>
      <TriggerMenuContent sideOffset={6} className={TOKEN_POPUP_CLASS}>
        <TriggerMenuEmpty className="px-3 py-3 text-center font-sans text-xs text-muted-foreground empty:hidden">
          {(s) => (s.empty && !s.loading ? (emptyText ?? "没有匹配项") : null)}
        </TriggerMenuEmpty>
        <TriggerMenuList className="flex max-h-56 flex-col gap-0.5 overflow-y-auto outline-none">
          {(state) =>
            (state.items as TriggerMenuDataItem[]).map((item) => {
              const badge = badgeMap.get(`${state.trigger ?? ""}:${String(item.value)}`);
              return (
                <TriggerMenuItem
                  key={String(item.value)}
                  value={String(item.value)}
                  label={item.label}
                  disabled={item.disabled}
                  className={TOKEN_POPUP_ITEM_CLASS}
                >
                  <span className="truncate font-medium">{item.label}</span>
                  {badge && (
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {badge}
                    </span>
                  )}
                </TriggerMenuItem>
              );
            })
          }
        </TriggerMenuList>
      </TriggerMenuContent>
    </SdkTriggerMenu>
  );
};

const TokenEditorBox = ({ p, labelId }: { p: TokenInputProps; labelId: string }) => {
  const defaultAriaLabel = p.label ? undefined : "结构化上下文输入框";
  return (
    <div
      data-slot="token-input-shell"
      data-disabled={p.disabled ? "" : undefined}
      className={tokenShellVariants({
        variant: p.variant ?? "default",
        invalid: Boolean(p.error),
      })}
    >
      <TokenInputEditor
        aria-label={p.ariaLabel ?? defaultAriaLabel}
        aria-labelledby={p.label ? labelId : undefined}
        placeholder={p.placeholder ?? "输入提示词，或键入 @ 插入上下文标签…"}
        className={TOKEN_EDITOR_CLASS}
      />
      {p.footer && (
        <div className="flex items-center justify-between gap-2 border-t border-solid border-border/60 px-3 py-1.5">
          {p.footer}
        </div>
      )}
    </div>
  );
};

const TokenFeedbackMessage = ({ error, hint }: { error?: string; hint?: string }) => {
  if (error) {
    return (
      <p role="alert" className="m-0 text-xs text-destructive">
        {error}
      </p>
    );
  }
  if (hint) return <p className="m-0 text-[11px] text-muted-foreground">{hint}</p>;
  return null;
};

export const TokenInput = (props: TokenInputProps) => {
  const labelId = useId();
  const removable = props.removable ?? true;
  const canRemove = removable && !props.disabled && !props.readOnly;
  const hasTriggers = Boolean(props.triggers && props.triggers.length > 0);

  return (
    <div
      data-slot="token-input-wrapper"
      className={cn("flex w-full flex-col gap-1.5", props.className)}
    >
      {props.label && (
        <label id={labelId} className="font-sans text-xs font-medium text-foreground">
          {props.label}
        </label>
      )}
      <SdkTokenInput
        value={toSdkValue(props.value)}
        defaultValue={toSdkValue(props.defaultValue)}
        tokenDeletion={props.tokenDeletion}
        submitShortcut={props.submitShortcut}
        name={props.name}
        disabled={props.disabled}
        readOnly={props.readOnly}
        onValueChange={(next) => props.onValueChange?.(fromSdkValue(next), toText(next))}
        onSubmit={(next) => props.onSubmit?.(fromSdkValue(next), toText(next))}
        renderToken={(token) => <InlineTokenChip raw={token} canRemove={canRemove} />}
      >
        <TokenEditorBox p={props} labelId={labelId} />
        {hasTriggers && (
          <InlineTriggerPopup triggers={props.triggers!} emptyText={props.emptyText} />
        )}
      </SdkTokenInput>
      <TokenFeedbackMessage error={props.error} hint={props.hint} />
    </div>
  );
};

export { serializeTokenValue };
