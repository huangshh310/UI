import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { AiAgentActivity, type AiAgentActivityItemData } from "../../index.js";

afterEach(cleanup);

const ITEMS: AiAgentActivityItemData[] = [
  {
    id: "step-1",
    type: "searching",
    title: "检索京都东山区路线",
    description: "匹配开放时间与步行距离",
    status: "success",
    duration: "68ms",
    details: {
      input: { district: "东山区", radiusKm: 2.5 },
      output: "已筛选 4 处步行可达的建筑与咖啡空间",
    },
  },
  {
    id: "step-2",
    type: "code_execution",
    title: "生成行程时间表",
    status: "running",
    duration: "140ms",
    details: {
      codeSnippet: "const route = sortByWalkingDistance(places);",
      language: "typescript",
    },
  },
];

describe("AiAgentActivity", () => {
  it("支持展开单步参数明细与一键全部展开/收起", async () => {
    const user = userEvent.setup();
    render(<AiAgentActivity activities={ITEMS} isRunning title="行程规划追踪" />);

    expect(screen.getByText("行程规划追踪")).toBeTruthy();
    expect(screen.getByText("运行中")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /检索京都东山区路线/ }));
    expect(screen.getByText(/已筛选 4 处步行可达/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "全部展开" }));
    expect(screen.getByText(/sortByWalkingDistance/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "全部收起" }));
    expect(
      screen.getByRole("button", { name: /检索京都东山区路线/ }).getAttribute("aria-expanded"),
    ).toBe("false");
    expect(
      screen.getByRole("button", { name: /生成行程时间表/ }).getAttribute("aria-expanded"),
    ).toBe("false");
  });
});
