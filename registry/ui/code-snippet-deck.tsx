// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * CodeSnippetDeck：同一个接口调用的多语言代码片段。
 *
 * 上方的页签切换语言，下方的参数面板编辑参数或点选预设并实时代入高亮，
 * 内置完整的语言页签方向键切换与无障碍语义。
 */

import { cn } from "@/lib/utils";
import { Tabs } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Copy, RotateCcw, SlidersHorizontal, WrapText } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const deckOuterVariants = cva("@container w-full min-w-0 max-w-2xl font-sans", {
  variants: {
    variant: {
      default:
        "overflow-hidden rounded-[22px] border border-solid border-border bg-card text-card-foreground shadow-[0_12px_32px_-12px_rgba(0,0,0,0.08)]",
      terminal:
        "overflow-hidden rounded-[22px] border border-solid border-[#26262c] bg-[#111114] text-[#fafafa] shadow-[0_16px_40px_-14px_rgba(0,0,0,0.35)] [color-scheme:dark]",
      elevated:
        "rounded-[26px] border border-solid border-border/80 bg-secondary/75 p-1.5 text-card-foreground shadow-[0_12px_36px_-14px_rgba(0,0,0,0.08)]",
      minimal:
        "overflow-hidden rounded-2xl border border-solid border-border bg-card text-card-foreground shadow-xs",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const deckInnerVariants = cva("overflow-hidden", {
  variants: {
    variant: {
      default: "",
      terminal: "",
      elevated: "rounded-[20px] border border-solid border-border/80 bg-card shadow-xs",
      minimal: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const deckHeaderVariants = cva(
  "flex min-w-0 flex-wrap items-center justify-between gap-2.5 border-b border-solid px-4 py-2.5",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-muted/65",
        terminal: "border-[#26262c] bg-[#18181c]",
        elevated: "border-border/80 bg-muted/55",
        minimal: "border-border/70 bg-card py-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const deckTabListVariants = cva(
  "inline-flex min-w-0 items-center gap-0.5 rounded-full p-0.5",
  {
    variants: {
      variant: {
        default: "bg-secondary ring-1 ring-border/70",
        terminal: "bg-[#111114] ring-1 ring-white/10",
        elevated: "bg-secondary ring-1 ring-border/70",
        minimal: "bg-secondary/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const deckTabVariants = cva(
  "shrink-0 cursor-pointer rounded-full border-0 bg-transparent px-2.5 py-1 font-mono text-xs font-medium outline-none transition-all duration-(--ui-duration-fast) focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground hover:text-foreground aria-selected:bg-card aria-selected:text-foreground aria-selected:shadow-xs",
        terminal:
          "text-[#a1a1aa] hover:text-[#fafafa] aria-selected:bg-[#27272e] aria-selected:text-[#fafafa]",
        elevated:
          "text-muted-foreground hover:text-foreground aria-selected:bg-card aria-selected:text-foreground aria-selected:shadow-xs",
        minimal:
          "text-muted-foreground hover:text-foreground aria-selected:bg-card aria-selected:text-foreground aria-selected:shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const deckStageVariants = cva("outline-none", {
  variants: {
    variant: {
      default: "bg-background/70 dark:bg-background/60",
      terminal: "bg-[#111114]",
      elevated: "bg-background/75 dark:bg-background/60",
      minimal: "bg-secondary/35 dark:bg-background/50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const deckParamPanelVariants = cva("border-t border-solid px-4 py-3.5", {
  variants: {
    variant: {
      default: "border-border/80 bg-card",
      terminal: "border-[#26262c] bg-[#16161b]",
      elevated: "border-border/80 bg-card",
      minimal: "border-border/70 bg-card py-3",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const deckInputVariants = cva(
  "h-9 w-full min-w-0 rounded-xl border border-solid px-3 font-mono text-xs transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
  {
    variants: {
      variant: {
        default:
          "border-input/55 bg-secondary/30 text-foreground shadow-xs hover:border-input/85 focus-visible:bg-card dark:border-border dark:bg-secondary/45",
        terminal:
          "border-white/12 bg-[#1f1f26] text-[#fafafa] placeholder:text-[#71717a] hover:border-white/25",
        elevated:
          "border-input/55 bg-secondary/30 text-foreground shadow-xs hover:border-input/85 focus-visible:bg-card dark:border-border dark:bg-secondary/45",
        minimal:
          "border-input/55 bg-secondary/40 text-foreground hover:border-input/85 focus-visible:bg-card dark:border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
export type CodeSnippetDeckVariant = NonNullable<VariantProps<typeof deckOuterVariants>["variant"]>;

/** 一种语言的代码模板。模板中的 {{参数名}} 会被替换为参数的当前值 */
export interface Snippet {
  /** 唯一标识，例如 "python" */
  language: string;
  /** 页签上显示的名称 */
  label: string;
  /** 可选文件名（例如 "request.sh" / "client.ts"），优先于全局 title 展示 */
  filename?: string;
  code: string;
}

/** 一个可编辑的参数 */
export interface SnippetParameter {
  /** 模板中引用的名字 */
  name: string;
  /** 输入框的标签 */
  label: string;
  defaultValue: string;
  /** 输入框占位提示 */
  placeholder?: string;
  /** 可选快捷预设值列表，点击芯片即可快速代入 */
  options?: string[];
}

export interface CodeSnippetDeckProps {
  snippets: Snippet[];
  parameters?: SnippetParameter[];
  /** 视觉风格：编辑卡、曜石黑终端、双层浮雕画框或极简命令条 */
  variant?: CodeSnippetDeckVariant;
  /** 顶部标题或接口路径（例如 "/v1/projects"） */
  title?: string;
  /** 顶部标题前的紧凑徽章（例如 "GET" / "POST" / "CLI"） */
  badge?: string;
  /** 是否显示顶部的窗口装饰点，默认显示（minimal 变体默认隐藏） */
  showWindowBar?: boolean;
  /** 是否在左侧显示代码行号（不污染复制内容与 textContent） */
  showLineNumbers?: boolean;
  /** 是否高亮代码中由参数实时代入的片段，并在聚焦参数框时联动高亮，默认开启 */
  highlightParameters?: boolean;
  /** 默认是否开启自动换行 */
  wrapLines?: boolean;
  /** 是否在顶栏展示自动换行切换按钮 */
  allowWrapToggle?: boolean;
  /** 受控当前语言标识 */
  language?: string;
  /** 非受控初始语言标识 */
  defaultLanguage?: string;
  /** 切换语言页签时的回调 */
  onLanguageChange?: (language: string) => void;
  /** 点击复制按钮后的回调 */
  onCopy?: (code: string, language: string) => void;
  className?: string;
}
interface CodeSegment {
  type: "text" | "param";
  text: string;
  name?: string;
}

const PLACEHOLDER = /\{\{(\w+)\}\}/g;

const fillTemplate = (code: string, values: Record<string, string>): string =>
  code.replace(PLACEHOLDER, (placeholder, name: string) => values[name] ?? placeholder);

const tokenizeTemplate = (code: string, values: Record<string, string>): CodeSegment[] => {
  const segments: CodeSegment[] = [];
  let cursor = 0;

  for (const match of code.matchAll(PLACEHOLDER)) {
    const start = match.index ?? 0;
    if (start > cursor) {
      segments.push({ type: "text", text: code.slice(cursor, start) });
    }
    const name = match[1] ?? "";
    segments.push({
      type: "param",
      name,
      text: values[name] ?? match[0],
    });
    cursor = start + match[0].length;
  }

  if (cursor < code.length) {
    segments.push({ type: "text", text: code.slice(cursor) });
  }

  return segments;
};
/** 「已复制」反馈的持续时间 */
const FEEDBACK_MS = 1600;

const copyButtonClass = (isTerminal: boolean, copied: boolean) =>
  cn(
    "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-solid px-2.5 font-mono text-[11px] font-medium transition-colors duration-(--ui-duration-fast) outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid",
    isTerminal
      ? "border-white/12 bg-white/5 text-[#d4d4d8] hover:bg-white/12 hover:text-[#fafafa]"
      : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground",
    copied &&
      (isTerminal ? "border-signal/60 text-[#fafafa]" : "border-foreground/25 text-foreground"),
  );

const SnippetCopyButton = ({
  text,
  variant,
  onCopied,
}: {
  text: string;
  variant: CodeSnippetDeckVariant;
  onCopied?: () => void;
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    onCopied?.();
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCopied(false);
    }, FEEDBACK_MS);
  };

  return (
    <button
      type="button"
      aria-label="Copy code"
      onClick={copy}
      className={copyButtonClass(variant === "terminal", copied)}
    >
      {copied ? (
        <Check aria-hidden="true" className="size-3.5" />
      ) : (
        <Copy aria-hidden="true" className="size-3.5" />
      )}
      <span aria-hidden="true">{copied ? "已复制" : "复制"}</span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
};
const chipClass = (isTerminal: boolean, selected: boolean) => {
  if (selected) return "border-signal bg-signal text-signal-foreground";
  return isTerminal
    ? "border-white/12 bg-white/5 text-[#a1a1aa] hover:border-white/25 hover:text-[#fafafa]"
    : "border-border bg-secondary/70 text-muted-foreground hover:border-foreground/20 hover:text-foreground";
};

const PresetChips = ({
  options,
  currentValue,
  isTerminal,
  onSelect,
}: {
  options?: string[];
  currentValue: string;
  isTerminal: boolean;
  onSelect: (value: string) => void;
}) => {
  if (!options || options.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 pt-0.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={cn(
            "cursor-pointer rounded-full border border-solid px-2 py-0.5 font-mono text-[10px] font-medium transition-colors duration-(--ui-duration-fast) outline-none focus-visible:outline-2 focus-visible:outline-ring",
            chipClass(isTerminal, option === currentValue),
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

const ParameterField = ({
  param,
  value,
  variant,
  isTerminal,
  onChange,
  onFocusParam,
}: {
  param: SnippetParameter;
  value: string;
  variant: CodeSnippetDeckVariant;
  isTerminal: boolean;
  onChange: (value: string) => void;
  onFocusParam: (name: string | null) => void;
}) => (
  <div className="flex min-w-0 flex-col gap-1.5">
    <label
      className={cn(
        "flex min-w-0 flex-col gap-1.5 text-[11px] font-medium",
        isTerminal ? "text-[#a1a1aa]" : "text-muted-foreground",
      )}
    >
      <span>{param.label}</span>
      <input
        value={value}
        placeholder={param.placeholder}
        onFocus={() => onFocusParam(param.name)}
        onBlur={() => onFocusParam(null)}
        onChange={(event) => onChange(event.target.value)}
        className={deckInputVariants({ variant })}
      />
    </label>
    <PresetChips
      options={param.options}
      currentValue={value}
      isTerminal={isTerminal}
      onSelect={onChange}
    />
  </div>
);

interface ParameterPanelProps {
  variant: CodeSnippetDeckVariant;
  parameters: SnippetParameter[];
  values: Record<string, string>;
  dirty: boolean;
  onChange: (name: string, value: string) => void;
  onFocusParam: (name: string | null) => void;
  onReset: () => void;
}

const PanelHeader = ({
  isTerminal,
  dirty,
  onReset,
}: {
  isTerminal: boolean;
  dirty: boolean;
  onReset: () => void;
}) => (
  <div className="mb-2.5 flex items-center justify-between gap-2">
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wider uppercase",
        isTerminal ? "text-[#a1a1aa]" : "text-muted-foreground",
      )}
    >
      <SlidersHorizontal aria-hidden="true" className="size-3" />
      实时参数
    </span>
    {dirty && (
      <button
        type="button"
        aria-label="重置参数"
        onClick={onReset}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 rounded-full border-0 bg-transparent px-2 py-0.5 font-mono text-[11px] font-medium transition-colors duration-(--ui-duration-fast) outline-none focus-visible:outline-2 focus-visible:outline-ring",
          isTerminal
            ? "text-[#a1a1aa] hover:bg-white/10 hover:text-[#fafafa]"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
      >
        <RotateCcw aria-hidden="true" className="size-3" />
        重置
      </button>
    )}
  </div>
);

const ParameterPanel = (props: ParameterPanelProps) => {
  const isTerminal = props.variant === "terminal";

  return (
    <div className={deckParamPanelVariants({ variant: props.variant })}>
      <PanelHeader isTerminal={isTerminal} dirty={props.dirty} onReset={props.onReset} />
      <div className="grid grid-cols-1 gap-3 @md:grid-cols-2">
        {props.parameters.map((param) => (
          <ParameterField
            key={param.name}
            param={param}
            value={props.values[param.name] ?? ""}
            variant={props.variant}
            isTerminal={isTerminal}
            onChange={(next) => props.onChange(param.name, next)}
            onFocusParam={props.onFocusParam}
          />
        ))}
      </div>
    </div>
  );
};
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

interface DeckHeaderProps {
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

const DeckHeader = (props: DeckHeaderProps) => {
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

interface CodeStageProps {
  variant: CodeSnippetDeckVariant;
  template: string;
  code: string;
  values: Record<string, string>;
  showLineNumbers: boolean;
  highlightParameters: boolean;
  wrapLines: boolean;
  focusedParam: string | null;
}

const CodeStage = (props: CodeStageProps) => {
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
const buildDefaults = (parameters: SnippetParameter[]) =>
  Object.fromEntries(parameters.map(({ name, defaultValue }) => [name, defaultValue]));

const isModified = (parameters: SnippetParameter[], values: Record<string, string>) =>
  parameters.some(({ name, defaultValue }) => (values[name] ?? "") !== defaultValue);

const useDeckState = (props: CodeSnippetDeckProps) => {
  const parameters = props.parameters ?? [];
  const [internalLanguage, setInternalLanguage] = useState(
    props.defaultLanguage ?? props.snippets[0]?.language ?? "",
  );
  const [values, setValues] = useState(() => buildDefaults(parameters));
  const [focusedParam, setFocusedParam] = useState<string | null>(null);
  const [wrapLines, setWrapLines] = useState(Boolean(props.wrapLines));

  const language = props.language ?? internalLanguage;
  const active = props.snippets.find((item) => item.language === language) ?? props.snippets[0];
  const template = active?.code ?? "";
  const code = active ? fillTemplate(template, values) : "";

  const selectLanguage = (next: string) => {
    if (props.language === undefined) setInternalLanguage(next);
    props.onLanguageChange?.(next);
  };

  const updateParam = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  return {
    parameters,
    language,
    active,
    template,
    code,
    values,
    focusedParam,
    wrapLines,
    dirty: isModified(parameters, values),
    selectLanguage,
    updateParam,
    setFocusedParam,
    toggleWrap: () => setWrapLines((prev) => !prev),
    resetParams: () => setValues(buildDefaults(parameters)),
  };
};

const DeckTabs = ({
  props,
  variant,
  state,
}: {
  props: CodeSnippetDeckProps;
  variant: CodeSnippetDeckVariant;
  state: ReturnType<typeof useDeckState>;
}) => (
  <Tabs.Root value={state.language} onValueChange={(next) => state.selectLanguage(String(next))}>
    <DeckHeader
      variant={variant}
      snippets={props.snippets}
      code={state.code}
      showWindowBar={props.showWindowBar ?? variant !== "minimal"}
      badge={props.badge}
      title={state.active?.filename ?? props.title}
      allowWrapToggle={Boolean(props.allowWrapToggle)}
      wrapLines={state.wrapLines}
      onToggleWrap={state.toggleWrap}
      onCopied={() => props.onCopy?.(state.code, state.language)}
    />
    <Tabs.Panel value={state.language} className={deckStageVariants({ variant })}>
      <CodeStage
        variant={variant}
        template={state.template}
        code={state.code}
        values={state.values}
        showLineNumbers={Boolean(props.showLineNumbers)}
        highlightParameters={props.highlightParameters ?? true}
        wrapLines={state.wrapLines}
        focusedParam={state.focusedParam}
      />
    </Tabs.Panel>
  </Tabs.Root>
);

export const CodeSnippetDeck = (props: CodeSnippetDeckProps) => {
  const variant = (props.variant ?? "default") as CodeSnippetDeckVariant;
  const state = useDeckState(props);

  return (
    <div
      data-slot="code-snippet-deck"
      data-variant={variant}
      className={cn(deckOuterVariants({ variant }), props.className)}
    >
      <div className={deckInnerVariants({ variant })}>
        <DeckTabs props={props} variant={variant} state={state} />
        {state.parameters.length > 0 && (
          <ParameterPanel
            variant={variant}
            parameters={state.parameters}
            values={state.values}
            dirty={state.dirty}
            onChange={state.updateParam}
            onFocusParam={state.setFocusedParam}
            onReset={state.resetParams}
          />
        )}
      </div>
    </div>
  );
};
