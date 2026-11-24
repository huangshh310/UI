/**
 * AiSurface React 挂载外壳行为规约：流式保护、校验拦截、Submitted / Cancelled 与 Escape 浮层取消。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AiSurface,
  isControl,
  isKind,
  rankWith,
  type SurfaceAnswer,
  type SurfaceDataSchema,
  type SurfaceRendererEntry,
  type SurfaceRendererProps,
  type SurfaceView,
} from "../../index.js";

afterEach(cleanup);

const TestControlRenderer = ({ node, data, errors, onValueChange }: SurfaceRendererProps) => {
  if (node.kind !== "control") return null;
  const field = node.scope.replace("#/properties/", "");
  const label = node.label ?? field;
  return (
    <label>
      <span>{label}</span>
      <input
        aria-label={label}
        value={String(data[field] ?? "")}
        onChange={(e) => onValueChange(field, e.target.value)}
      />
      {errors[field] && <span role="alert">{errors[field]}</span>}
    </label>
  );
};

const TestButtonRenderer = ({
  node,
  nodeId,
  disabled,
  streaming,
  onTriggerAction,
}: SurfaceRendererProps) => {
  if (node.kind !== "button") return null;
  const blocked = Boolean(node.disabled) || disabled || (streaming && node.intent === "submit");
  return (
    <button
      type="button"
      disabled={blocked}
      onClick={() => onTriggerAction(node.actionId, nodeId, node.intent, node.payload)}
    >
      {node.label}
    </button>
  );
};

const CUSTOM_RENDERERS: SurfaceRendererEntry[] = [
  { id: "test-control", tester: rankWith(5, isControl), renderer: TestControlRenderer },
  { id: "test-button", tester: rankWith(5, isKind("button")), renderer: TestButtonRenderer },
];

const FORM_SCHEMA: SurfaceDataSchema = {
  required: ["service"],
  properties: {
    service: { type: "string", title: "服务名", minLength: 3, default: "ab" },
  },
};

const FORM_VIEW: SurfaceView = {
  main: [
    { kind: "control", scope: "#/properties/service", label: "服务名" },
    { kind: "button", actionId: "deploy", label: "立即发布", intent: "submit" },
    { kind: "button", actionId: "abort", label: "取消", intent: "cancel" },
  ],
  layer: { kind: "badge", label: "确认浮层" },
};

describe("AiSurface 交互外壳", () => {
  it("打通流式提交保护、同步校验拦截、Submitted / Cancelled 与 Escape 取消闭环", async () => {
    const user = userEvent.setup();
    const onResolve = vi.fn<(answer: SurfaceAnswer) => void>();

    const { rerender } = render(
      <AiSurface
        schema={FORM_SCHEMA}
        uischema={FORM_VIEW}
        renderers={CUSTOM_RENDERERS}
        streaming
        onResolve={onResolve}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: "立即发布" }) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);

    rerender(
      <AiSurface
        schema={FORM_SCHEMA}
        uischema={FORM_VIEW}
        renderers={CUSTOM_RENDERERS}
        onResolve={onResolve}
      />,
    );
    expect(submitBtn.disabled).toBe(false);

    await user.click(submitBtn);
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(onResolve).not.toHaveBeenCalled();

    const input = screen.getByLabelText("服务名");
    await user.clear(input);
    await user.type(input, "gateway");
    await user.click(submitBtn);

    expect(onResolve).toHaveBeenCalledWith({
      status: "submitted",
      actionId: "deploy",
      values: { service: "gateway" },
    });

    await user.click(screen.getByRole("button", { name: "取消" }));
    expect(onResolve).toHaveBeenLastCalledWith({
      status: "cancelled",
      actionId: "abort",
    });

    await user.keyboard("{Escape}");
    expect(onResolve).toHaveBeenLastCalledWith({
      status: "cancelled",
      reason: "escape",
    });
  });

  it("未注册自定义渲染器的扩展语义节点安全回退至零崩溃兜底渲染器", () => {
    const { container } = render(
      <AiSurface
        uischema={{
          main: { kind: "x-telemetry", key: " custom", status: "done", tone: "success" },
        }}
      />,
    );
    const fallback = container.querySelector('[data-slot="ai-surface-fallback"]');
    expect(fallback?.textContent).toBe("x-telemetry (done)");
  });
});
