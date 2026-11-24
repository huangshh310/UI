"use client";

/**
 * AiSurfaceAgent：预装高阶智能体领域渲染器（审批、差异审阅、工具轨迹、产物画布、溯源、层级树与交互数据表）的语义视图容器。
 */
import { AiSurface } from "../ai-surface/index.js";
import { agentSurfaceRenderers } from "./ai-surface-agent-4-registry.js";
import type { AiSurfaceAgentProps } from "./ai-surface-agent.types.js";

export const AiSurfaceAgent = ({ renderers, ...props }: AiSurfaceAgentProps) => (
  <AiSurface
    {...props}
    renderers={renderers ? [...agentSurfaceRenderers, ...renderers] : agentSurfaceRenderers}
  />
);

export const AiAgentSurface = AiSurfaceAgent;

export { agentSurfaceRenderers };
