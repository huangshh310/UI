/**
 * Waterfall 行为规约：验证智能体多步追踪树表渲染、嵌套步骤展开折叠、行选中回调与里程碑标记。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Waterfall, type WaterfallSpan } from "../../index.js";

beforeAll(() => {
  if (typeof Element !== "undefined") {
    Element.prototype.getAnimations ??= () => [];
    Element.prototype.scrollIntoView ??= () => {};
  }
});

afterEach(cleanup);

const AGENT_TRACE: WaterfallSpan[] = [
  {
    value: "agent-turn",
    label: "智能体任务主循环",
    start: 0,
    duration: 940,
    tone: "signal",
    meta: "2.4k tok",
    children: [
      {
        value: "retrieve",
        label: "知识库语义召回",
        start: 18,
        duration: 210,
        tone: "success",
        meta: "6 命中",
      },
      {
        value: "tool-sql",
        label: "聚合查询执行",
        start: 240,
        duration: 380,
        tone: "default",
        meta: "SQL",
        children: [
          {
            value: "db-read",
            label: "只读副本扫描",
            start: 260,
            duration: 320,
            tone: "warning",
            meta: "128 行",
          },
        ],
      },
      {
        value: "synthesis",
        label: "结构化响应流式生成",
        start: 630,
        duration: 310,
        tone: "signal",
        meta: "流式",
      },
    ],
  },
];

describe("Waterfall", () => {
  it("渲染 treegrid 追踪瀑布流与里程碑标记，支持按初始展开列表展示子步骤及选中回调", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(val: string | null, span?: WaterfallSpan) => void>();

    render(
      <Waterfall
        ariaLabel="智能体调用链路"
        items={AGENT_TRACE}
        defaultExpanded={["agent-turn"]}
        milestones={[{ time: 650, label: "首字响应 TTFT" }]}
        onValueChange={onValueChange}
      />,
    );

    expect(screen.getByRole("treegrid", { name: "智能体调用链路" })).toBeTruthy();
    expect(screen.getByText("首字响应 TTFT")).toBeTruthy();
    expect(screen.getByText("知识库语义召回")).toBeTruthy();
    expect(screen.queryByText("只读副本扫描")).toBeNull();

    await user.click(screen.getByText("知识库语义召回"));
    expect(onValueChange).toHaveBeenCalledWith(
      "retrieve",
      expect.objectContaining({ value: "retrieve", duration: 210 }),
    );
  });

  it("开启 showControls 时支持一键全部展开与全部折叠嵌套步骤，并触发 onExpandedChange", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn<(expanded: string[]) => void>();

    render(
      <Waterfall
        ariaLabel="调用耗时分析"
        title="本轮执行追踪"
        showControls
        items={AGENT_TRACE}
        onExpandedChange={onExpandedChange}
      />,
    );

    expect(screen.queryByText("只读副本扫描")).toBeNull();

    await user.click(screen.getByRole("button", { name: "全部展开" }));
    expect(screen.getByText("只读副本扫描")).toBeTruthy();
    expect(onExpandedChange).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "全部折叠" }));
    expect(screen.queryByText("只读副本扫描")).toBeNull();
  });
});
