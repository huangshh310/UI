/**
 * AiSurfaceAgent Stage 3 行为规约：
 * 验证 rank 5 智能体领域渲染器（审批、差异审阅、工具轨迹、产物画布、引用溯源、树、可检索表格与组合框）及自定义覆盖。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  AiAgentSurface,
  AiSurfaceAgent,
  agentSurfaceRenderers,
  isKind,
  rankWith,
  type SurfaceActionEvent,
  type SurfaceAnswer,
  type SurfaceDataSchema,
  type SurfaceView,
} from "../../index.js";

beforeAll(() => {
  if (typeof Element !== "undefined" && !Element.prototype.getAnimations) {
    Element.prototype.getAnimations = () => [];
  }
});

afterEach(cleanup);

describe("AiSurfaceAgent 审批、差异与工具轨迹桥接", () => {
  it("approval 节点渲染审批护栏卡片，切换策略并批准/拒绝回传结构化 SurfaceAnswer", async () => {
    const user = userEvent.setup();
    const onResolve = vi.fn<(answer: SurfaceAnswer) => void>();

    const view: SurfaceView = {
      main: {
        kind: "approval",
        title: "执行生产数据库迁移",
        command: "pnpm db:migrate --prod",
        riskLevel: "high",
        approveActionId: "approve-migrate",
        rejectActionId: "reject-migrate",
        approvalOptions: [
          { id: "once", label: "仅本次授权" },
          { id: "session", label: "当前会话内信任" },
        ],
      },
    };

    expect(agentSurfaceRenderers.length).toBeGreaterThanOrEqual(8);
    const { unmount } = render(<AiSurfaceAgent uischema={view} onResolve={onResolve} />);

    expect(screen.getByText("执行生产数据库迁移")).toBeTruthy();
    await user.click(screen.getByText("当前会话内信任"));
    await user.click(screen.getByRole("button", { name: /批准执行/ }));

    expect(onResolve).toHaveBeenCalledWith({
      status: "submitted",
      actionId: "approve-migrate",
      values: { approvalOption: "session" },
    });
    unmount();

    render(<AiAgentSurface uischema={view} onResolve={onResolve} />);
    await user.click(screen.getByRole("button", { name: /拒绝/ }));
    expect(onResolve).toHaveBeenLastCalledWith({
      status: "cancelled",
      actionId: "reject-migrate",
    });
  });

  it("diff 与 tool-call 节点桥接行级变更审阅与失败重试动作", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn<(event: SurfaceActionEvent) => void>();

    const view: SurfaceView = {
      main: [
        {
          kind: "diff",
          fileName: "src/config.ts",
          applyActionId: "apply-patch",
          lines: [
            { id: "l1", lineNumber: 1, type: "remove", content: "timeout: 1000," },
            { id: "l2", lineNumber: 1, type: "add", content: "timeout: 5000," },
          ],
        },
        {
          kind: "tool-call",
          toolName: "query_cluster_metrics",
          status: "error",
          summary: "上游网关连接超时",
          retryActionId: "retry-metrics",
        },
      ],
    };

    render(<AiSurfaceAgent uischema={view} onAction={onAction} />);
    expect(screen.getByText("src/config.ts")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /应用.*变更/ }));
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        actionId: "apply-patch",
        payload: { acceptedLineIds: ["l1", "l2"] },
      }),
    );

    await user.click(screen.getByRole("button", { name: /query_cluster_metrics/ }));
    await user.click(screen.getByRole("button", { name: /重试/ }));
    expect(onAction).toHaveBeenLastCalledWith(
      expect.objectContaining({ actionId: "retry-metrics" }),
    );
  });
});

describe("AiSurfaceAgent 产物、溯源、树与高阶数据控件升级", () => {
  it("artifact、citation 与 tree 节点分别渲染产物画布、纯净引用卡片与可选择层级树", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn<(event: SurfaceActionEvent) => void>();

    const view: SurfaceView = {
      main: [
        {
          kind: "artifact",
          title: "网关限流策略",
          artifactType: "code",
          language: "ts",
          versionLabel: "v3",
          summary: "令牌桶突发限流配置",
          content: "export const rateLimit = 120;",
        },
        {
          kind: "citation",
          index: 2,
          title: "架构容量白皮书",
          domain: "docs.internal",
          snippet: "单节点峰值吞吐上限为 12,000 RPS。",
        },
        {
          kind: "tree",
          title: "服务拓扑",
          defaultExpandedIds: ["core"],
          selectActionId: "pick-node",
          items: [
            {
              id: "core",
              label: "核心集群",
              children: [{ id: "auth-svc", label: "认证网关", badge: "Healthy" }],
            },
          ],
        },
      ],
    };

    render(<AiSurfaceAgent uischema={view} onAction={onAction} />);
    expect(screen.getByText("网关限流策略")).toBeTruthy();
    expect(screen.getAllByText("架构容量白皮书").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/单节点峰值吞吐上限为 12,000 RPS。/)).toBeTruthy();

    await user.click(screen.getByText("认证网关"));
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        actionId: "pick-node",
        payload: { selectedId: "auth-svc" },
      }),
    );
  });

  const UPGRADE_SCHEMA: SurfaceDataSchema = {
    properties: {
      region: {
        type: "string",
        title: "目标可用区",
        oneOf: [
          { value: "ap-east-1", label: "亚太东一区" },
          { value: "eu-west-1", label: "欧洲西一区" },
        ],
      },
    },
  };

  const UPGRADE_VIEW: SurfaceView = {
    main: [
      {
        kind: "table",
        title: "节点清单",
        searchable: true,
        columns: [{ key: "host", header: "主机名", sortable: true }],
        rows: [{ host: "worker-alpha" }, { host: "worker-beta" }],
      },
      {
        kind: "control",
        scope: "#/properties/region",
        controlType: "combobox",
        placeholder: "检索可用区",
      },
      { kind: "badge", label: "默认徽章" },
    ],
  };

  it("带检索特征的 table 升级为 DataTable，controlType=combobox 升级为可搜索组合框，并支持更高优先级覆盖", async () => {
    const user = userEvent.setup();
    const onDataChange = vi.fn<(data: Record<string, unknown>, field: string) => void>();
    const customBadge = {
      id: "custom-badge",
      tester: rankWith(6, isKind("badge")),
      renderer: () => <div data-testid="custom-override">业务接管徽章</div>,
    };

    const { container } = render(
      <AiSurfaceAgent
        schema={UPGRADE_SCHEMA}
        uischema={UPGRADE_VIEW}
        renderers={[customBadge]}
        onDataChange={onDataChange}
      />,
    );

    expect(container.querySelector('[data-slot="agent-surface-data-table"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="agent-surface-combobox"]')).toBeTruthy();
    expect(screen.getByTestId("custom-override").textContent).toBe("业务接管徽章");

    await user.type(screen.getByPlaceholderText(/搜索/), "beta");
    expect(screen.queryByText("worker-alpha")).toBeNull();
    expect(screen.getByText("worker-beta")).toBeTruthy();

    await user.click(screen.getByPlaceholderText("检索可用区"));
    await user.click(screen.getByText("欧洲西一区"));
    expect(onDataChange).toHaveBeenCalledWith({ region: "eu-west-1" }, "region");
  });
});
