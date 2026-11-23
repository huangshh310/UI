"use client";

/**
 * CodeSnippetDeck 的参数控制面板：输入框、快捷预设芯片与一键重置按钮。
 */
import { cn } from "@matt-ui/utils";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { CodeSnippetDeckVariant, SnippetParameter } from "./code-snippet-deck.types.js";
import { deckInputVariants, deckParamPanelVariants } from "./code-snippet-deck.variants.js";

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

export interface ParameterPanelProps {
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

export const ParameterPanel = (props: ParameterPanelProps) => {
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
