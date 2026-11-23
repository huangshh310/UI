"use client";

/**
 * AiCitation：Perplexity / Claude Search 风格的现代行内角标与分层来源溯源卡。
 */
import { cn } from "@matt-ui/utils";
import { useState } from "react";
import {
  CitationAnswerBlock,
  CitationSourcePreview,
  CitationSourceStrip,
} from "./ai-citation.parts.js";
import type { AiCitationProps, AiCitationSource } from "./ai-citation.types.js";
import {
  CITATION_DEFAULT_ANSWER,
  CITATION_DEFAULT_SOURCES,
  citationShellVariants,
} from "./ai-citation.variants.js";

const resolveCitationDefaults = (props: AiCitationProps) => {
  const sources = props.sources ?? CITATION_DEFAULT_SOURCES;
  return {
    variant: props.variant ?? "card",
    answer: props.answer ?? CITATION_DEFAULT_ANSWER,
    sources,
    initialId: props.defaultActiveId ?? sources[0]?.id ?? "",
  };
};

export const AiCitation = (props: AiCitationProps) => {
  const cfg = resolveCitationDefaults(props);
  const [activeId, setActiveId] = useState(cfg.initialId);
  const active = cfg.sources.find((s) => s.id === activeId) ?? cfg.sources[0];
  const isInline = cfg.variant === "inline";

  const handlePick = (src: AiCitationSource) => {
    setActiveId(src.id);
    props.onSelect?.(src);
  };

  return (
    <div
      data-slot="ai-citation"
      data-variant={cfg.variant}
      className={cn(citationShellVariants({ variant: cfg.variant }), props.className)}
    >
      {cfg.answer && (
        <CitationAnswerBlock
          answer={cfg.answer}
          sources={cfg.sources}
          activeId={active?.id}
          onPick={handlePick}
        />
      )}
      <CitationSourceStrip sources={cfg.sources} activeId={active?.id} onPick={handlePick} />
      {active && <CitationSourcePreview source={active} inline={isInline} />}
    </div>
  );
};
