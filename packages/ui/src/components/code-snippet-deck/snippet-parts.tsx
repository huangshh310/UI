"use client";

/**
 * CodeSnippetDeck 的顶栏与代码舞台：窗口装饰、标题徽章、语言页签、换行开关、行号槽与动态参数高亮。
 */
import { Tabs } from "@base-ui/react/tabs";
import { cn } from "@matt-ui/utils";
import { WrapText } from "lucide-react";
import type { CodeSnippetDeckVariant, Snippet } from "./code-snippet-deck.types.js";
import {
  deckHeaderVariants,
  deckTabListVariants,
  deckTabVariants,
} from "./code-snippet-deck.variants.js";
import { tokenizeTemplate } from "./fill-template.js";
import { SnippetCopyButton } from "./snippet-copy-button.js";

const WindowDots = () => (
  <span aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
    <span className="size-2.5 rounded-full bg-[#ff5f57]/85" />
    <span className="size-2.5 rounded-full bg-[#febc2e]/85" />
    <span className="size-2.5 rounded-full bg-[#28c840]/85" />
  </span>
);

const HeaderBadge = ({
  badge,
  title,
  isTerminal,
}: {
  badge?: string;
  title?: string;
  isTerminal: boolean;
}) => {
  if (!badge && !title) return null;
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 font-mono text-[11px]">
      {badge && (
        <span
          className={cn(
            "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] leading-none font-semibold tracking-wider uppercase",
            isTerminal
              ? "bg-signal/22 text-[#b4c8ff]"
              : "bg-card text-signal ring-1 ring-signal/25 dark:bg-signal/22 dark:text-[#b4c8ff] dark:ring-signal/35",
          )}
        >
          {badge}
        </span>
      )}
      {title && (
        <span className={cn("truncate", isTerminal ? "text-[#a1a1aa]" : "text-muted-foreground")}>
          {title}
        </span>
      )}
    </span>
  );
};

const wrapButtonClass = (isTerminal: boolean, active: boolean) =>
  cn(
    "inline-flex size-7 cursor-pointer items-center justify-center rounded-full border border-solid transition-colors duration-(--ui-duration-fast) outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid",
    isTerminal
      ? "border-white/12 bg-white/5 text-[#a1a1aa] hover:bg-white/12 hover:text-[#fafafa]"
      : "border-border bg-card text-muted-foreground hover:text-foreground",
    active &&
      (isTerminal
        ? "border-signal/60 bg-signal/20 text-[#fafafa]"
        : "border-signal/55 bg-card text-signal dark:bg-signal/20 dark:text-[#b4c8ff]"),
  );

export interface DeckHeaderProps {
  variant: CodeSnippetDeckVariant;
  snippets: Snippet[];
  code: string;
  showWindowBar: boolean;
  badge?: string;
  title?: string;
  allowWrapToggle: boolean;
  wrapLines: boolean;
  onToggleWrap: () => void;
  onCopied: () => void;
}

export const DeckHeader = (props: DeckHeaderProps) => {
  const isTerminal = props.variant === "terminal";

  return (
    <div className={deckHeaderVariants({ variant: props.variant })}>
      <div className="flex min-w-0 flex-wrap items-center gap-2.5">
        {props.showWindowBar && <WindowDots />}
        <Tabs.List className={deckTabListVariants({ variant: props.variant })}>
          {props.snippets.map(({ language, label }) => (
            <Tabs.Tab
              key={language}
              value={language}
              className={deckTabVariants({ variant: props.variant })}
            >
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <HeaderBadge badge={props.badge} title={props.title} isTerminal={isTerminal} />
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {props.allowWrapToggle && (
          <button
            type="button"
            aria-label="切换自动换行"
            aria-pressed={props.wrapLines}
            onClick={props.onToggleWrap}
            className={wrapButtonClass(isTerminal, props.wrapLines)}
          >
            <WrapText aria-hidden="true" className="size-3.5" />
          </button>
        )}
        <SnippetCopyButton text={props.code} variant={props.variant} onCopied={props.onCopied} />
      </div>
    </div>
  );
};

const paramMarkClass = (isTerminal: boolean, active: boolean) => {
  if (active) {
    return "rounded bg-signal px-1 py-0.5 font-medium text-signal-foreground transition-colors duration-(--ui-duration-fast)";
  }
  return isTerminal
    ? "rounded bg-signal/22 px-1 py-0.5 font-medium text-[#b4c8ff] transition-colors duration-(--ui-duration-fast)"
    : "rounded bg-signal/10 px-1 py-0.5 font-medium text-signal transition-colors duration-(--ui-duration-fast) dark:bg-signal/22 dark:text-[#b4c8ff]";
};

const LineGutter = ({ lineCount, isTerminal }: { lineCount: number; isTerminal: boolean }) => (
  <div
    aria-hidden="true"
    className={cn(
      "flex shrink-0 flex-col border-r border-solid py-4 pr-3 pl-4 text-right font-mono text-[11px] leading-6 select-none tabular-nums",
      isTerminal ? "border-white/8 text-[#71717a]" : "border-border/70 text-muted-foreground/75",
    )}
  >
    {Array.from({ length: lineCount }, (_, index) => (
      <span key={index + 1}>{index + 1}</span>
    ))}
  </div>
);

const HighlightedCode = ({
  template,
  values,
  isTerminal,
  focusedParam,
}: {
  template: string;
  values: Record<string, string>;
  isTerminal: boolean;
  focusedParam: string | null;
}) => {
  const segments = tokenizeTemplate(template, values);
  return (
    <>
      {segments.map((segment, index) =>
        segment.type === "param" ? (
          <mark
            key={`${segment.name}-${index}`}
            data-param={segment.name}
            className={paramMarkClass(isTerminal, focusedParam === segment.name)}
          >
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
};

export interface CodeStageProps {
  variant: CodeSnippetDeckVariant;
  template: string;
  code: string;
  values: Record<string, string>;
  showLineNumbers: boolean;
  highlightParameters: boolean;
  wrapLines: boolean;
  focusedParam: string | null;
}

export const CodeStage = (props: CodeStageProps) => {
  const isTerminal = props.variant === "terminal";

  return (
    <div className="flex min-w-0 items-stretch">
      {props.showLineNumbers && (
        <LineGutter lineCount={props.code.split("\n").length} isTerminal={isTerminal} />
      )}
      <pre
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        aria-label="Code"
        className={cn(
          "m-0 min-w-0 flex-1 overflow-x-auto px-4 py-4 font-mono text-xs leading-6 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
          props.wrapLines ? "break-all whitespace-pre-wrap" : "whitespace-pre",
          isTerminal ? "text-[#fafafa]" : "text-foreground",
        )}
      >
        <code data-testid="snippet-code">
          {props.highlightParameters ? (
            <HighlightedCode
              template={props.template}
              values={props.values}
              isTerminal={isTerminal}
              focusedParam={props.focusedParam}
            />
          ) : (
            props.code
          )}
        </code>
      </pre>
    </div>
  );
};
