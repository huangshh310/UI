"use client";

/**
 * CodeSnippetDeck：同一个接口调用的多语言代码片段。
 *
 * 上方的页签切换语言，下方的参数面板编辑参数或点选预设并实时代入高亮，
 * 页签的键盘导航与 ARIA 语义由 Base UI 的 Tabs 提供。
 */
import { Tabs } from "@base-ui/react/tabs";
import { cn } from "@matt-ui/utils";
import { useState } from "react";
import type {
  CodeSnippetDeckProps,
  CodeSnippetDeckVariant,
  SnippetParameter,
} from "./code-snippet-deck.types.js";
import {
  deckInnerVariants,
  deckOuterVariants,
  deckStageVariants,
} from "./code-snippet-deck.variants.js";
import { fillTemplate } from "./fill-template.js";
import { ParameterPanel } from "./snippet-params.js";
import { CodeStage, DeckHeader } from "./snippet-parts.js";

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
