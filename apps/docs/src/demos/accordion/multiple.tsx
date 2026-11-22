"use client";

import { Accordion } from "@matt-ui/ui";

export default function AccordionMultipleDemo() {
  return (
    <div className="w-full max-w-md">
      <Accordion
        multiple
        variant="boxed"
        defaultValue={["tokens", "registry"]}
        items={[
          {
            value: "tokens",
            title: "第一步：核对浅色与深色对比度",
            content: "确认文本不低于 4.5:1，输入边框与焦点环对背景不低于 3:1。",
          },
          {
            value: "registry",
            title: "第二步：生成并校验 Registry 清单",
            content: "运行 pnpm registry:generate && pnpm test:registry 验证独立 Vite 消费方构建。",
          },
          {
            value: "e2e",
            title: "第三步：执行 Playwright 双主题 E2E",
            content: "确认所有详情页无 axe 违规，无横向溢出与视觉裁切。",
          },
        ]}
      />
    </div>
  );
}
