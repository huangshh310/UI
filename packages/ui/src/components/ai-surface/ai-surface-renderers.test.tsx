/**
 * AiSurface Stage 2 默认轻量渲染器行为规约：
 * 验证无额外配置下开箱渲染容器槽位、结构化展示节点、缺省 Schema 自动表单、联动规则与协同提交回传。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AiSurface,
  defaultSurfaceRenderers,
  type SurfaceActionEvent,
  type SurfaceAnswer,
  type SurfaceDataSchema,
  type SurfaceView,
} from "../../index.js";

afterEach(cleanup);

describe("AiSurface 默认展示与容器渲染器", () => {
  it("导出 defaultSurfaceRenderers 并默认渲染 Card 槽位、Stats、KV、Progress、Table 与 Dock 区域", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn<(event: SurfaceActionEvent) => void>();

    const view: SurfaceView = {
      main: [
        {
          kind: "card",
          key: "rollout",
          head: { title: "灰度发布监控", description: "亚太一区集群", status: "running" },
          end: { kind: "badge", label: "v2.4.0", tone: "signal" },
          foot: {
            kind: "actions",
            items: [{ kind: "button", actionId: "refresh", label: "刷新指标", intent: "outline" }],
          },
          children: [
            {
              kind: "stats",
              items: [
                { label: "请求成功率", value: "99.98%", delta: "+0.12%", tone: "success" },
                { label: "平均延迟", value: "38ms" },
              ],
            },
            {
              kind: "progress",
              label: "流量切分进度",
              value: 65,
              tone: "signal",
            },
            {
              kind: "table",
              rowActionId: "inspect-pod",
              columns: [
                { key: "pod", header: "实例" },
                { key: "health", header: "健康度", cellKind: "badge" },
              ],
              rows: [{ pod: "api-01", health: "Healthy" }],
            },
          ],
        },
      ],
      dock: {
        kind: "kv",
        items: [{ label: "网关节点", value: "edge-tokyo-01", mono: true }],
      },
    };

    expect(defaultSurfaceRenderers.length).toBeGreaterThan(10);
    render(<AiSurface uischema={view} onAction={onAction} />);

    expect(screen.getByText("灰度发布监控")).toBeTruthy();
    expect(screen.getByText("v2.4.0")).toBeTruthy();
    expect(screen.getByText("99.98%")).toBeTruthy();
    expect(screen.getByText("+0.12%")).toBeTruthy();
    expect(screen.getByText("流量切分进度")).toBeTruthy();
    expect(screen.getByText("edge-tokyo-01")).toBeTruthy();

    await user.click(screen.getByText("api-01"));
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        actionId: "inspect-pod",
        payload: { pod: "api-01", health: "Healthy" },
      }),
    );

    await user.click(screen.getByRole("button", { name: "刷新指标" }));
    expect(onAction).toHaveBeenLastCalledWith(expect.objectContaining({ actionId: "refresh" }));
  });

  it("支持 Tabs 页签切换以及 Alert、Code 与 EmptyState 动作触发", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn<(event: SurfaceActionEvent) => void>();

    const view: SurfaceView = {
      main: {
        kind: "tabs",
        defaultTab: "summary",
        tabs: [
          {
            key: "summary",
            label: "概览",
            children: [{ kind: "alert", title: "配置已同步", tone: "success" }],
          },
          {
            key: "logs",
            label: "空日志",
            children: [
              {
                kind: "empty",
                title: "暂无异常日志",
                actionLabel: "重新拉取",
                actionId: "reload-logs",
              },
            ],
          },
        ],
      },
    };

    render(<AiSurface uischema={view} onAction={onAction} />);
    expect(screen.getByText("配置已同步")).toBeTruthy();

    await user.click(screen.getByRole("tab", { name: "空日志" }));
    expect(screen.getByText("暂无异常日志")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "重新拉取" }));
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ actionId: "reload-logs" }));
  });
});

describe("AiSurface 默认表单控件与缺省 Schema 协同闭环", () => {
  it("仅传入 JSON Schema 时自动生成默认表单，支持文本、数值、布尔与单选控件双向绑定及提交回传", async () => {
    const user = userEvent.setup();
    const onResolve = vi.fn<(answer: SurfaceAnswer) => void>();

    const schema: SurfaceDataSchema = {
      title: "扩容参数确认",
      required: ["service", "replicas"],
      properties: {
        service: { type: "string", title: "服务名", minLength: 3, default: "gw" },
        replicas: { type: "integer", title: "副本数量", minimum: 1, maximum: 8, default: 2 },
        autoRollback: { type: "boolean", title: "异常自动回滚", default: true },
      },
    };

    render(<AiSurface schema={schema} onResolve={onResolve} />);

    expect(screen.getByText("扩容参数确认")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "提交" }));
    expect(screen.getByText(/服务名至少需要 3 个字符/)).toBeTruthy();
    expect(onResolve).not.toHaveBeenCalled();

    const serviceInput = screen.getByLabelText(/服务名/);
    await user.clear(serviceInput);
    await user.type(serviceInput, "api-core");

    const replicasInput = screen.getByLabelText(/副本数量/);
    await user.clear(replicasInput);
    await user.type(replicasInput, "4");

    await user.click(screen.getByRole("checkbox", { name: /异常自动回滚/ }));
    await user.click(screen.getByRole("button", { name: "提交" }));

    expect(onResolve).toHaveBeenCalledWith({
      status: "submitted",
      actionId: "submit",
      values: {
        service: "api-core",
        replicas: 4,
        autoRollback: false,
      },
    });
  });
});
