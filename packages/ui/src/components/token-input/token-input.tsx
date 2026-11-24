"use client";

/**
 * TokenInput：结构化上下文标签输入框。
 * 在可编辑提示词正文中内联混排原子化上下文胶囊，支持退格策略配置、一键移除与触发浮层插入。
 */
import { cn } from "@matt-ui/utils";
import {
  TokenInput as SdkTokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
  toText,
  type Token,
} from "@ui-sdk/react/token-input";
import {
  TriggerMenu as SdkTriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuItem,
  TriggerMenuList,
  type TriggerMenuDataItem,
} from "@ui-sdk/react/trigger-menu";
import { Check, FileCode2, Loader2, Terminal, X } from "lucide-react";
import { useId, useMemo } from "react";
import {
  fromSdkToken,
  fromSdkValue,
  serializeTokenValue,
  toSdkValue,
  toTokenTriggerDefs,
} from "./token-input-1-helpers.js";
import type { TokenInputProps, TokenTriggerSource } from "./token-input.types.js";
import {
  TOKEN_CHIP_BASE_CLASS,
  TOKEN_EDITOR_CLASS,
  TOKEN_POPUP_CLASS,
  TOKEN_POPUP_ITEM_CLASS,
  TOKEN_TONE_CLASS,
  tokenShellVariants,
} from "./token-input.variants.js";

const ChipLeadIcon = ({ type, status }: { type: string; status?: string }) => {
  if (status === "loading") return <Loader2 aria-hidden="true" className="size-3 animate-spin" />;
  if (status === "done") return <Check aria-hidden="true" className="size-3 text-info" />;
  if (type === "skill" || type === "command") {
    return <Terminal aria-hidden="true" className="size-3 text-info" />;
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
        <div className="flex items-center justify-between gap-2 px-3 pt-0 pb-2">{p.footer}</div>
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
