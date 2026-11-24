/**
 * AiSurface 纯逻辑内核单元规约：路径派生、流式 Patch、Schema 推导校验、rankWith 与纯文本降级。
 */
import { describe, expect, it } from "vitest";
import {
  NOT_APPLICABLE,
  and,
  applySurfacePatch,
  deriveDefaultData,
  deriveSurfaceIds,
  deriveUiSchema,
  evaluateSurfaceRule,
  hasEnum,
  isControl,
  isKind,
  optionIs,
  or,
  rankWith,
  renderSurfaceText,
  schemaTypeIs,
  scopeEndsWith,
  selectSurfaceRenderer,
  validateSurfaceData,
  type SurfaceCardNode,
  type SurfaceDataSchema,
  type SurfaceNode,
  type SurfaceRendererEntry,
  type SurfaceView,
} from "../../index.js";

const DummyA = () => null;
const DummyB = () => null;
const DummyC = () => null;

const DEPLOY_SCHEMA: SurfaceDataSchema = {
  title: "发布配置",
  description: "确认目标环境与副本数量",
  required: ["service", "replicas"],
  properties: {
    service: { type: "string", title: "服务名称", minLength: 3, default: "api-gateway" },
    env: { type: "string", title: "目标环境", enum: ["staging", "production"], default: "staging" },
    replicas: { type: "integer", title: "副本数", minimum: 1, maximum: 10, default: 2 },
    reason: { type: "string", title: "生产变更说明" },
  },
};

describe("AiSurface 路径派生与增量 Patch", () => {
  it("按区域、显式 key 与槽位自动推导稳定节点 ID", () => {
    const view: SurfaceView = {
      main: [
        {
          kind: "card",
          key: "deploy",
          head: { title: "Deploy", status: "running" },
          end: { kind: "badge", label: "eu-west-1" },
          foot: {
            kind: "actions",
            items: [{ kind: "button", key: "retry", actionId: "retry", label: "重试" }],
          },
          children: [{ kind: "kv", items: [{ label: "service", value: "api-gateway" }] }],
        },
      ],
      dock: { kind: "code", key: "log", code: "listening :8080" },
    };

    const derived = deriveSurfaceIds(view);
    const card = (derived.main as SurfaceNode[])[0] as SurfaceCardNode;
    const endNode = card.end as SurfaceNode;
    const footNode = card.foot as SurfaceNode;
    const dockNode = derived.dock as SurfaceNode;

    expect(card.id).toBe("main.deploy");
    expect(endNode.id).toBe("main.deploy.end.0");
    expect(footNode.id).toBe("main.deploy.foot.0");
    expect(card.children?.[0]?.id).toBe("main.deploy.0");
    expect(dockNode.id).toBe("dock.log");
  });

  it("支持 mergeProps、appendItems、replace 与 remove 四种流式增量更新且不修改原对象", () => {
    const initial: SurfaceView = {
      main: [
        {
          kind: "card",
          key: "job",
          head: { title: "构建流水线", status: "running" },
          children: [
            { kind: "kv", key: "meta", items: [{ label: "branch", value: "main" }] },
            { kind: "text", key: "temp", text: "正在拉取缓存..." },
          ],
        },
      ],
    };

    const next = applySurfacePatch(initial, [
      {
        op: "mergeProps",
        targetId: "main.job",
        patch: { head: { title: "构建流水线", status: "done" } },
      },
      {
        op: "appendItems",
        targetId: "main.job.meta",
        items: [{ label: "duration", value: "14s" }],
      },
      {
        op: "replace",
        targetId: "main.job.temp",
        node: { kind: "badge", key: "temp", label: "缓存命中", tone: "success" },
      },
    ]);
    const removed = applySurfacePatch(next, { op: "remove", targetId: "main.job.temp" });

    const origText = renderSurfaceText(initial);
    const nextText = renderSurfaceText(next);
    const finalText = renderSurfaceText(removed);

    expect(origText).toContain("构建流水线 (running)");
    expect(nextText).toContain("构建流水线 (done)");
    expect(nextText).toContain("duration: 14s");
    expect(nextText).toContain("[缓存命中]");
    expect(finalText).not.toContain("[缓存命中]");
  });
});

describe("AiSurface JSON Schema 推导与校验", () => {
  it("提取默认值并在缺省 uischema 时自动推导表单视图", () => {
    const defaults = deriveDefaultData(DEPLOY_SCHEMA, { replicas: 4 });
    expect(defaults).toEqual({
      service: "api-gateway",
      env: "staging",
      replicas: 4,
    });

    const autoView = deriveUiSchema(DEPLOY_SCHEMA);
    const text = renderSurfaceText(autoView, defaults, DEPLOY_SCHEMA);
    expect(text).toContain("发布配置");
    expect(text).toContain("服务名称: api-gateway");
    expect(text).toContain("目标环境: staging");
    expect(text).toContain("副本数: 4");
  });

  it("对必填项、最小长度、整数、数值区间与枚举执行同步校验", () => {
    const errors = validateSurfaceData(DEPLOY_SCHEMA, { service: "ab", env: "dev", replicas: 12 });
    expect(errors.service).toBeTruthy();
    expect(errors.env).toBeTruthy();
    expect(errors.replicas).toBeTruthy();

    const missingErrors = validateSurfaceData(DEPLOY_SCHEMA, { service: "" });
    expect(missingErrors.service).toBeTruthy();
    expect(missingErrors.replicas).toBeTruthy();

    const floatErrors = validateSurfaceData(DEPLOY_SCHEMA, { service: "gateway", replicas: 2.5 });
    expect(floatErrors.replicas).toBeTruthy();

    const validErrors = validateSurfaceData(DEPLOY_SCHEMA, {
      service: "gateway",
      env: "production",
      replicas: 3,
    });
    expect(validErrors).toEqual({});
  });
});

describe("AiSurface rankWith 优先级匹配与纯文本降级", () => {
  it("组合谓词按得分匹配最高优先级渲染器，同分时后注册者覆盖前注册者", () => {
    const renderers: SurfaceRendererEntry[] = [
      { id: "base-control", tester: rankWith(2, isControl), renderer: DummyA },
      {
        id: "enum-control",
        tester: rankWith(4, and(isControl, schemaTypeIs("string"), hasEnum)),
        renderer: DummyB,
      },
      {
        id: "env-override",
        tester: rankWith(4, and(isControl, or(scopeEndsWith("env"), optionIs("searchable", true)))),
        renderer: DummyC,
      },
    ];

    const controlNode = { kind: "control" as const, scope: "#/properties/env" };
    const matched = selectSurfaceRenderer(renderers, controlNode, {
      schema: DEPLOY_SCHEMA,
      propertySchema: DEPLOY_SCHEMA.properties.env,
      data: {},
      streaming: false,
    });
    expect(matched?.id).toBe("env-override");

    const unmatched = selectSurfaceRenderer(
      [{ id: "only-badge", tester: rankWith(2, isKind("badge")), renderer: DummyA }],
      controlNode,
      { data: {}, streaming: false },
    );
    expect(unmatched).toBeUndefined();
    expect(NOT_APPLICABLE).toBe(-1);
  });

  it("纯数据求值联动规则，并在纯文本序列化时过滤隐藏节点", () => {
    const showRule = {
      effect: "SHOW" as const,
      condition: { scope: "#/properties/env", eq: "production" },
    };
    expect(evaluateSurfaceRule(showRule, { env: "staging" }).visible).toBe(false);
    expect(evaluateSurfaceRule(showRule, { env: "production" }).visible).toBe(true);
    expect(
      evaluateSurfaceRule(
        { effect: "DISABLE", condition: { scope: "locked", truthy: true } },
        { locked: true },
      ).disabled,
    ).toBe(true);

    const view: SurfaceView = {
      main: [
        {
          kind: "card",
          head: { title: "Canary Rollout", status: "done" },
          children: [
            { kind: "stats", items: [{ label: "成功率", value: "99.98%", delta: "+0.12%" }] },
            {
              kind: "table",
              columns: [
                { key: "pod", header: "实例" },
                { key: "state", header: "状态" },
              ],
              rows: [{ pod: "api-01", state: "Ready" }],
            },
            { kind: "text", text: "仅生产可见的告警提示", rule: showRule },
          ],
        },
      ],
      dock: { kind: "kv", items: [{ label: "cluster", value: "ap-northeast-1" }] },
    };

    const text = renderSurfaceText(view, { env: "staging" });
    expect(text).toContain("Canary Rollout (done)");
    expect(text).toContain("成功率: 99.98% (+0.12%)");
    expect(text).toContain("实例 | 状态");
    expect(text).toContain("api-01 | Ready");
    expect(text).toContain("cluster: ap-northeast-1");
    expect(text).not.toContain("仅生产可见的告警提示");
  });

  it("严格符合协议规范一致性测试向量 A（派生 ID 与未知路径容错）", () => {
    const vectorA: SurfaceView = {
      main: {
        kind: "card",
        key: "deploy",
        end: { kind: "badge", label: "准备中" },
        children: [{ kind: "progress", key: "bar", value: 20 }],
      },
    };
    const patched = applySurfacePatch(vectorA, [
      { op: "mergeProps", targetId: "main.deploy.bar", patch: { value: 100 } },
      { op: "remove", targetId: "main.non-existent" },
    ]);
    expect(renderSurfaceText(patched)).toBe("[准备中]\n100/100");
  });
});
