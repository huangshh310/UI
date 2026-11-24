"use client";

/**
 * 示例：JSON Schema 自动校验、声明式联动规则（SurfaceRule）与人机协同决议回传。
 */
import {
  AiSurface,
  type SurfaceAnswer,
  type SurfaceDataSchema,
  type SurfaceView,
} from "@matt-ui/ui";
import { useState } from "react";

const DEPLOY_SCHEMA: SurfaceDataSchema = {
  required: ["service", "replicas"],
  properties: {
    service: {
      type: "string",
      title: "目标服务名",
      minLength: 3,
      default: "core-api",
    },
    replicas: {
      type: "integer",
      title: "扩容副本数",
      minimum: 1,
      maximum: 16,
      default: 4,
    },
    strategy: {
      type: "string",
      title: "发布策略",
      default: "canary",
      oneOf: [
        { value: "canary", label: "金丝雀渐进切流", badge: "推荐" },
        { value: "rolling", label: "滚动批次替换" },
      ],
    },
    autoRollback: {
      type: "boolean",
      title: "错误率超阈值时自动回滚",
      default: true,
    },
    rollbackWindow: {
      type: "integer",
      title: "回滚观察窗口（分钟）",
      minimum: 1,
      maximum: 60,
      default: 5,
    },
  },
};

const DEPLOY_VIEW: SurfaceView = {
  main: {
    kind: "card",
    head: { title: "生产容量变更确认", description: "智能体在执行扩容前请求确认关键运行参数" },
    foot: {
      kind: "actions",
      items: [
        { kind: "button", actionId: "cancel-scale", label: "放弃变更", intent: "cancel" },
        { kind: "button", actionId: "confirm-scale", label: "确认并提交", intent: "submit" },
      ],
    },
    children: [
      {
        kind: "grid",
        columns: 2,
        children: [
          { kind: "control", scope: "#/properties/service" },
          { kind: "control", scope: "#/properties/replicas" },
        ],
      },
      { kind: "control", scope: "#/properties/strategy", controlType: "radio" },
      { kind: "control", scope: "#/properties/autoRollback" },
      {
        kind: "control",
        scope: "#/properties/rollbackWindow",
        rule: {
          effect: "SHOW",
          condition: { scope: "#/properties/autoRollback", eq: true },
        },
      },
    ],
  },
};

const formatAnswerText = (answer: SurfaceAnswer | null): string => {
  if (!answer) return "等待用户确认或取消表单决议…";
  if (answer.status === "submitted") {
    return `已提交 (${answer.actionId})：${JSON.stringify(answer.values)}`;
  }
  if (answer.status === "cancelled") {
    return `已取消 (${answer.actionId ?? answer.reason ?? "user"})`;
  }
  return answer.fallbackText;
};

export const AiSurfaceSchemaAsk = () => {
  const [streaming, setStreaming] = useState(false);
  const [answer, setAnswer] = useState<SurfaceAnswer | null>(null);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          {streaming ? "流式生成中：提交按钮处于防误触锁定态" : "就绪态：可修改参数并提交决议"}
        </span>
        <button
          type="button"
          onClick={() => setStreaming((prev) => !prev)}
          className="cursor-pointer rounded-lg border border-solid border-border bg-card px-2.5 py-1 font-sans text-xs font-medium text-foreground shadow-xs transition-colors outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset"
        >
          {streaming ? "结束流式锁定" : "模拟流式生成锁定"}
        </button>
      </div>
      <AiSurface
        schema={DEPLOY_SCHEMA}
        uischema={DEPLOY_VIEW}
        streaming={streaming}
        onResolve={setAnswer}
      />
      <div
        data-testid="surface-answer-log"
        className="rounded-xl border border-solid border-border/75 bg-muted/35 px-3.5 py-2.5 font-mono text-xs text-foreground"
      >
        {formatAnswerText(answer)}
      </div>
    </div>
  );
};

export default AiSurfaceSchemaAsk;
