// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * CodeSnippetDeck：同一个接口调用的多语言代码片段。
 *
 * 上方的页签切换语言，下方的输入框编辑参数，参数值实时代入每一种语言的代码。
 * 页签的键盘导航与 ARIA 语义由 Base UI 的 Tabs 提供。
 */

import { cn } from "@/lib/utils";
import { Tabs } from "@base-ui/react/tabs";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** 一种语言的代码模板。模板中的 {{参数名}} 会被替换为参数的当前值 */
export interface Snippet {
  /** 唯一标识，例如 "python" */
  language: string;
  /** 页签上显示的名称 */
  label: string;
  code: string;
}

/** 一个可编辑的参数 */
export interface SnippetParameter {
  /** 模板中引用的名字 */
  name: string;
  /** 输入框的标签 */
  label: string;
  defaultValue: string;
}

export interface CodeSnippetDeckProps {
  snippets: Snippet[];
  parameters?: SnippetParameter[];
  /** 是否显示顶部的窗口栏，默认显示 */
  showWindowBar?: boolean;
  className?: string;
}
const fillTemplate = (code: string, values: Record<string, string>): string =>
  code.replace(/\{\{(\w+)\}\}/g, (placeholder, name: string) => values[name] ?? placeholder);
/** 「已复制」反馈的持续时间 */
const FEEDBACK_MS = 1600;

const SnippetCopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), FEEDBACK_MS);
  };

  return (
    <button
      type="button"
      aria-label="Copy code"
      onClick={copy}
      className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4" />
      ) : (
        <Copy aria-hidden="true" className="size-4" />
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
};
const defaults = (parameters: SnippetParameter[]) =>
  Object.fromEntries(parameters.map(({ name, defaultValue }) => [name, defaultValue]));

const TAB_CLASSES =
  "shrink-0 cursor-pointer rounded-md border-0 bg-transparent px-2.5 py-1 font-mono text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid aria-selected:bg-accent aria-selected:text-foreground";

const INPUT_CLASSES =
  "h-9 w-full min-w-0 rounded-lg border border-solid border-border bg-background px-3 font-mono text-sm text-foreground shadow-sm transition-[border-color,box-shadow] duration-(--ui-duration-fast) outline-none hover:border-foreground/22 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 dark:bg-secondary/50";

/** 页签栏：窗口栏装饰、语言页签与复制按钮 */
const DeckHeader = ({
  snippets,
  code,
  showWindowBar,
}: {
  snippets: Snippet[];
  code: string;
  showWindowBar: boolean;
}) => (
  <div className="flex min-w-0 items-center gap-3 border-b border-solid border-border px-4 py-2">
    {showWindowBar && (
      <span aria-hidden="true" className="flex shrink-0 gap-1.5">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
      </span>
    )}
    <Tabs.List className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
      {snippets.map(({ language, label }) => (
        <Tabs.Tab key={language} value={language} className={TAB_CLASSES}>
          {label}
        </Tabs.Tab>
      ))}
    </Tabs.List>
    <SnippetCopyButton text={code} />
  </div>
);

interface ParameterFieldsProps {
  parameters: SnippetParameter[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

/** 参数输入区：每个参数一个带标签的输入框 */
const ParameterFields = ({ parameters, values, onChange }: ParameterFieldsProps) => (
  <div className="grid gap-3 border-t border-solid border-border px-5 py-4 sm:grid-cols-2">
    {parameters.map(({ name, label }) => (
      <label key={name} className="flex min-w-0 flex-col gap-1.5 text-xs text-muted-foreground">
        {label}
        <input
          value={values[name] ?? ""}
          onChange={(event) => onChange(name, event.target.value)}
          className={INPUT_CLASSES}
        />
      </label>
    ))}
  </div>
);

export const CodeSnippetDeck = ({
  snippets,
  parameters = [],
  showWindowBar = true,
  className,
}: CodeSnippetDeckProps) => {
  const [language, setLanguage] = useState(snippets[0]?.language ?? "");
  const [values, setValues] = useState(() => defaults(parameters));
  const active = snippets.find((snippet) => snippet.language === language) ?? snippets[0];
  const code = active ? fillTemplate(active.code, values) : "";

  return (
    <div
      data-slot="code-snippet-deck"
      className={cn(
        "w-full min-w-0 max-w-xl overflow-hidden rounded-2xl border border-solid border-border bg-card font-sans text-card-foreground shadow-md",
        className,
      )}
    >
      <Tabs.Root value={language} onValueChange={(value) => setLanguage(String(value))}>
        <DeckHeader snippets={snippets} code={code} showWindowBar={showWindowBar} />
        <Tabs.Panel value={language} className="outline-none">
          {/* 代码过长时横向滚动。滚动区域必须能用键盘聚焦（WCAG 2.1.1），所以这里有意给 pre 加 tabIndex */}
          <pre
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            aria-label="Code"
            className="m-0 overflow-x-auto px-5 py-4 font-mono text-[13px] leading-relaxed outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
          >
            <code data-testid="snippet-code">{code}</code>
          </pre>
        </Tabs.Panel>
      </Tabs.Root>
      {parameters.length > 0 && (
        <ParameterFields
          parameters={parameters}
          values={values}
          onChange={(name, value) => setValues({ ...values, [name]: value })}
        />
      )}
    </div>
  );
};
